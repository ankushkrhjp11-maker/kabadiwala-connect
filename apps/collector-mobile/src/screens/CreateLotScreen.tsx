
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Button, Card, Chip, Field } from '../components/UI';
import { Screen } from '../components/Screen';
import type { AppRoute } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { createLot as saveLocalLot } from '../database/database';
import { API_BASE_URL } from '../config/api';

import {
  validateEwastePhoto,
  type PhotoValidationResult,
} from '../services/photoValidation';

const MATERIALS = [
  { id: 'pcb', label: 'PCB', icon: '🟩' },
  { id: 'cables', label: 'Cables', icon: '🔌' },
  { id: 'battery', label: 'Batteries', icon: '🔋' },
  { id: 'crt', label: 'CRT', icon: '📺' },
  { id: 'lcd', label: 'LCD / LED', icon: '🖥️' },
  { id: 'motor', label: 'Motors', icon: '⚙️' },
  { id: 'plastic', label: 'Mixed Plastics', icon: '♻️' },
  { id: 'other', label: 'Other E-waste', icon: '📦' },
];

type Props = {
  onNavigate: (route: AppRoute) => void;
};

type ImageAsset = ImagePicker.ImagePickerAsset;

export function CreateLotScreen({ onNavigate }: Props) {
  const [step, setStep] = useState(1);

  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoAsset, setPhotoAsset] =
    useState<ImageAsset | null>(null);

  const [photoValidation, setPhotoValidation] =
    useState<PhotoValidationResult | null>(null);

  const [validatingPhoto, setValidatingPhoto] =
    useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedMaterial = useMemo(
    () =>
      MATERIALS.find(
        (item) => item.id === category,
      ),
    [category],
  );

  const numericWeight = Number(weight);

  /*
   * CURRENT AI RESPONSE SAFE HANDLING
   *
   * Current backend response:
   *
   * validation: {
   *   decision: "PROCEED",
   *   confidence: null
   * }
   *
   * Older response may contain decision/confidence
   * directly at the top level.
   */

  const aiData = photoValidation as unknown as {
    decision?: string;
    reason?: string;
    confidence?: number | null;
    predictedCategory?: string;
    selectedCategory?: string;

    validation?: {
      decision?: string;
      message?: string;
      confidence?: number | null;
    };
  };

  const aiDecision =
    aiData?.validation?.decision ??
    aiData?.decision ??
    null;

  const aiConfidence =
    aiData?.validation?.confidence ??
    aiData?.confidence ??
    null;

  const aiReason =
    aiData?.reason ??
    aiData?.validation?.message ??
    null;

  /*
   * ACCEPT:
   * Actual model verification.
   *
   * PROCEED:
   * Current image-validation service successfully
   * validated the uploaded image.
   */

  const aiCanProceed =
    aiDecision === 'ACCEPT' ||
    aiDecision === 'PROCEED';

  const estimatedRange = useMemo(() => {
    if (
      !numericWeight ||
      numericWeight <= 0 ||
      !category
    ) {
      return null;
    }

    /*
     * Temporary prototype rates.
     * These should later come from the Price Board API/DB.
     */
    const rates: Record<
      string,
      [number, number]
    > = {
      pcb: [120, 220],
      cables: [80, 150],
      battery: [45, 90],
      crt: [20, 45],
      lcd: [35, 70],
      motor: [70, 130],
      plastic: [15, 35],
      other: [20, 60],
    };

    const [lowRate, highRate] =
      rates[category] ?? [20, 60];

    return {
      low: Math.round(
        numericWeight * lowRate,
      ),
      high: Math.round(
        numericWeight * highRate,
      ),
    };
  }, [category, numericWeight]);

  /**
   * AI PHOTO VALIDATION
   */
  async function verifyPhoto(
    asset: ImageAsset,
    selectedCategory: string,
  ) {
    if (!selectedCategory) {
      setPhotoValidation(null);

      Alert.alert(
        'Select material first',
        'Please select the material category before verifying the photo.',
      );

      return;
    }

    try {
      setValidatingPhoto(true);
      setPhotoValidation(null);

      console.log(
        '[AI] Starting photo validation',
      );

      console.log(
        '[AI] API:',
        `${API_BASE_URL}/ai/validate-image`,
      );

      const result =
        await validateEwastePhoto(
          asset,
          selectedCategory,
        );

      console.log(
        '[AI] Validation result:',
        result,
      );

      setPhotoValidation(result);

      const resultData =
        result as unknown as {
          decision?: string;
          reason?: string;
          confidence?: number | null;
          validation?: {
            decision?: string;
            message?: string;
            confidence?: number | null;
          };
        };

      const decision =
        resultData?.validation?.decision ??
        resultData?.decision ??
        null;

      const confidence =
        resultData?.validation?.confidence ??
        resultData?.confidence ??
        null;

      const reason =
        resultData?.reason ??
        resultData?.validation?.message ??
        'The image has been validated.';

      if (
        decision === 'ACCEPT' ||
        decision === 'PROCEED'
      ) {
        const confidenceText =
          confidence != null
            ? `\n\nConfidence: ${Math.round(
                confidence * 100,
              )}%`
            : '';

        Alert.alert(
          'Photo verified ✓',
          `${reason}${confidenceText}`,
        );
      } else if (
        decision === 'REJECT'
      ) {
        Alert.alert(
          'Photo rejected',
          reason ||
            'The image does not match the selected e-waste material.',
        );
      } else {
        Alert.alert(
          'Verification required',
          reason ||
            'The image needs additional verification.',
        );
      }
    } catch (error) {
      console.error(
        '[AI] Photo validation error:',
        error,
      );

      setPhotoValidation(null);

      Alert.alert(
        'AI verification failed',
        'The photo could not be verified. Please check that the API and AI service are running and the phone is connected to the same network.',
      );
    } finally {
      setValidatingPhoto(false);
    }
  }

  /**
   * CAMERA
   */
  async function takePhoto() {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera permission needed',
          'Please allow camera access to photograph the collected e-waste item.',
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });

      if (
        result.canceled ||
        !result.assets[0]?.uri
      ) {
        return;
      }

      const asset = result.assets[0];

      setPhotoUri(asset.uri);
      setPhotoAsset(asset);
      setPhotoValidation(null);

      if (category) {
        await verifyPhoto(
          asset,
          category,
        );
      }
    } catch (error) {
      console.error(
        'Camera error:',
        error,
      );

      Alert.alert(
        'Camera error',
        'Unable to open the camera. Please try again.',
      );
    }
  }

  /**
   * GALLERY
   */
  async function chooseFromGallery() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Gallery permission needed',
          'Please allow photo access to select an e-waste image.',
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });

      if (
        result.canceled ||
        !result.assets[0]?.uri
      ) {
        return;
      }

      const asset = result.assets[0];

      setPhotoUri(asset.uri);
      setPhotoAsset(asset);
      setPhotoValidation(null);

      if (category) {
        await verifyPhoto(
          asset,
          category,
        );
      }
    } catch (error) {
      console.error(
        'Gallery error:',
        error,
      );

      Alert.alert(
        'Gallery error',
        'Unable to select the image. Please try again.',
      );
    }
  }

  /**
   * PHOTO MENU
   */
  function handlePhotoPress() {
    Alert.alert(
      'Add e-waste photo',
      'A clear photo of the actual collected item is required.',
      [
        {
          text: 'Take photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from gallery',
          onPress: chooseFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  /**
   * MATERIAL SELECT
   */
  async function handleCategorySelect(
    materialId: string,
  ) {
    setCategory(materialId);
    setPhotoValidation(null);

    if (photoAsset) {
      await verifyPhoto(
        photoAsset,
        materialId,
      );
    }
  }

  /**
   * STEP 1 → STEP 2
   */
  async function continueToStepTwo() {
    if (!photoUri || !photoAsset) {
      Alert.alert(
        'Photo required',
        'Please take or select a clear photo of the collected e-waste item.',
      );

      return;
    }

    if (!category) {
      Alert.alert(
        'Select material',
        'Please select the material category.',
      );

      return;
    }

    if (
      !numericWeight ||
      numericWeight <= 0
    ) {
      Alert.alert(
        'Enter weight',
        'Please enter a valid approximate weight in kilograms.',
      );

      return;
    }

    if (validatingPhoto) {
      Alert.alert(
        'Please wait',
        'AI is still checking the photo. Please wait until verification is complete.',
      );

      return;
    }

    /*
     * If validation hasn't happened yet,
     * start it automatically.
     */
    if (!photoValidation) {
      Alert.alert(
        'Checking photo',
        'The photo will be verified before continuing.',
      );

      await verifyPhoto(
        photoAsset,
        category,
      );

      return;
    }

    /*
     * ACCEPT and PROCEED are both allowed.
     */
    if (!aiCanProceed) {
      Alert.alert(
        'Photo verification required',
        aiReason ||
          'The photo could not be verified. Please upload a clearer image.',
      );

      return;
    }

    /*
     * predictedCategory is optional.
     *
     * Current demo AI does not return it,
     * so it must NOT block lot creation.
     */
    if (
      aiData.predictedCategory &&
      aiData.predictedCategory !== category
    ) {
      Alert.alert(
        'Wrong material',
        `You selected "${selectedMaterial?.label}", but AI detected "${aiData.predictedCategory}". Please select the correct material or upload the correct photo.`,
      );

      return;
    }

    /*
     * selectedCategory is checked only
     * when the backend provides it.
     */
    if (
      aiData.selectedCategory &&
      aiData.selectedCategory !== category
    ) {
      Alert.alert(
        'Material mismatch',
        'The selected material does not match the verified photo.',
      );

      return;
    }

    setStep(2);
  }

  /**
   * SAVE LOT
   */
  async function saveLot() {
    if (!photoUri || !photoAsset) {
      Alert.alert(
        'Photo required',
        'A photo is required before saving the lot.',
      );

      setStep(1);
      return;
    }

    if (validatingPhoto) {
      Alert.alert(
        'Please wait',
        'AI is still verifying the photo.',
      );

      return;
    }

    if (!photoValidation) {
      Alert.alert(
        'Photo verification required',
        'Please verify the photo before saving the lot.',
      );

      setStep(1);
      return;
    }

    /*
     * ACCEPT and PROCEED are valid.
     */
    if (!aiCanProceed) {
      Alert.alert(
        'Photo verification required',
        aiReason ||
          'This lot cannot be saved because the photo has not passed validation.',
      );

      setStep(1);
      return;
    }

    /*
     * Only check predictedCategory if available.
     */
    if (
      aiData.predictedCategory &&
      aiData.predictedCategory !== category
    ) {
      Alert.alert(
        'Material mismatch',
        'The verified photo does not match the selected material.',
      );

      setStep(1);
      return;
    }

    /*
     * Only check selectedCategory if available.
     */
    if (
      aiData.selectedCategory &&
      aiData.selectedCategory !== category
    ) {
      Alert.alert(
        'Material mismatch',
        'The selected material does not match the verified photo.',
      );

      setStep(1);
      return;
    }

    if (!selectedMaterial) {
      Alert.alert(
        'Material required',
        'Please select the material category.',
      );

      setStep(1);
      return;
    }

    if (
      !numericWeight ||
      numericWeight <= 0
    ) {
      Alert.alert(
        'Invalid weight',
        'Please enter a valid approximate weight.',
      );

      setStep(1);
      return;
    }

    if (!estimatedRange) {
      Alert.alert(
        'Value unavailable',
        'Unable to calculate the preliminary value.',
      );

      return;
    }

    try {
      setSaving(true);

      const lotId =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      const reference =
        `KC-2026-${Date.now()
          .toString()
          .slice(-5)}`;

      await saveLocalLot({
        id: lotId,
        reference,
        materialId:
          selectedMaterial.id,
        materialName:
          selectedMaterial.label,
        materialIcon:
          selectedMaterial.icon,
        weightKg:
          numericWeight,
        estimatedLow:
          estimatedRange.low,
        estimatedHigh:
          estimatedRange.high,
        notes,
        photoUri,
        status: 'PENDING_SYNC',
        collectionDate:
          new Date().toISOString(),
        location:
          'Location unavailable',
        synced: 0,
      });

      setSaved(true);
    } catch (error) {
      console.error(
        'Failed to save lot:',
        error,
      );

      Alert.alert(
        'Could not save lot',
        'The lot could not be saved on this device. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  /**
   * RESET
   */
  function resetForm() {
    setStep(1);
    setCategory('');
    setWeight('');
    setNotes('');

    setPhotoUri(null);
    setPhotoAsset(null);
    setPhotoValidation(null);

    setValidatingPhoto(false);

    setSaved(false);
    setSaving(false);
  }

  /**
   * SUCCESS SCREEN
   */
  if (saved) {
    return (
      <Screen
        title="Lot saved"
        subtitle="Your collection record is saved on this phone."
        showBack
        onBack={() =>
          onNavigate('dashboard')
        }
      >
        <Card accent>
          <View style={styles.successIcon}>
            <Text
              style={
                styles.successIconText
              }
            >
              ✓
            </Text>
          </View>

          <Chip>
            OFFLINE SAVED
          </Chip>

          <Text style={styles.savedTitle}>
            Lot is ready to sync
          </Text>

          <Text style={styles.savedText}>
            Your collection details and
            validated photo are stored on
            this phone. They can be
            synchronized with the
            recycling network when
            internet is available.
          </Text>

          <View style={styles.summaryBox}>
            <Text
              style={styles.summaryLabel}
            >
              MATERIAL
            </Text>

            <Text
              style={styles.summaryValue}
            >
              {selectedMaterial?.icon}{' '}
              {selectedMaterial?.label}
            </Text>

            <Text
              style={styles.summaryLabel}
            >
              APPROX. WEIGHT
            </Text>

            <Text
              style={styles.summaryValue}
            >
              {weight} kg
            </Text>

            <Text
              style={styles.summaryLabel}
            >
              PHOTO
            </Text>

            <Text
              style={styles.summaryValue}
            >
              Photo Validated ✓
            </Text>

            <Text
              style={styles.summaryLabel}
            >
              STATUS
            </Text>

            <Text
              style={styles.summaryValue}
            >
              Pending sync
            </Text>
          </View>

          <Button
            label="View my lots"
            onPress={() =>
              onNavigate('myLots')
            }
          />

          <Button
            label="Create another lot"
            variant="secondary"
            onPress={resetForm}
          />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen
      title="Create a lot"
      subtitle="Add what you collected today."
      showBack
      onBack={() =>
        onNavigate('dashboard')
      }
    >
      <Card>

        {/* PROGRESS */}
        <View style={styles.progressRow}>
          <Text style={styles.step}>
            STEP {step} OF 2
          </Text>

          <Text style={styles.stepStatus}>
            {step === 1
              ? 'ITEM DETAILS'
              : 'REVIEW & VALUE'}
          </Text>
        </View>

        {/* STEP 1 */}
        {step === 1 ? (
          <>

            {/* PHOTO */}
            <View
              style={
                styles.sectionHeadingRow
              }
            >
              <View style={styles.stepNumber}>
                <Text
                  style={
                    styles.stepNumberText
                  }
                >
                  1
                </Text>
              </View>

              <View>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Add a photo *
                </Text>

                <Text
                  style={
                    styles.requiredText
                  }
                >
                  Required for photo validation
                </Text>
              </View>
            </View>

            <Pressable
              style={[
                styles.photoBox,
                photoUri &&
                  styles.photoBoxFilled,
              ]}
              onPress={
                handlePhotoPress
              }
            >
              {photoUri ? (
                <>
                  <Image
                    source={{
                      uri: photoUri,
                    }}
                    style={
                      styles.photoPreview
                    }
                  />

                  <View
                    style={[
                      styles.verifiedPhotoBadge,

                      aiDecision ===
                        'REJECT' &&
                        styles.rejectedPhotoBadge,

                      validatingPhoto &&
                        styles.checkingPhotoBadge,
                    ]}
                  >
                    <Text
                      style={
                        styles.verifiedPhotoText
                      }
                    >
                      {validatingPhoto
                        ? 'AI CHECKING...'
                        : aiCanProceed
                          ? '✓ PHOTO VALIDATED'
                          : aiDecision ===
                              'REJECT'
                            ? '✕ PHOTO REJECTED'
                            : 'PHOTO ADDED'}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.photoOverlay
                    }
                  >
                    <Text
                      style={
                        styles.photoOverlayText
                      }
                    >
                      Change photo
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={
                      styles.cameraCircle
                    }
                  >
                    <Text
                      style={
                        styles.cameraIcon
                      }
                    >
                      📷
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.photoTitle
                    }
                  >
                    Take a photo
                  </Text>

                  <Text
                    style={
                      styles.photoSubtitle
                    }
                  >
                    Clear e-waste photo only
                  </Text>

                  <Text
                    style={
                      styles.photoHint
                    }
                  >
                    AI service will validate the
                    uploaded image before you continue
                  </Text>
                </>
              )}
            </Pressable>

            {/* AI STATUS */}
            {photoUri && (
              <View
                style={[
                  styles.aiStatusBox,

                  validatingPhoto &&
                    styles.aiStatusChecking,

                  aiCanProceed &&
                    styles.aiStatusAccepted,

                  aiDecision ===
                    'REJECT' &&
                    styles.aiStatusRejected,
                ]}
              >
                <Text
                  style={
                    styles.aiStatusIcon
                  }
                >
                  {validatingPhoto
                    ? '🤖'
                    : aiCanProceed
                      ? '✓'
                      : aiDecision ===
                          'REJECT'
                        ? '✕'
                        : 'AI'}
                </Text>

                <View
                  style={
                    styles.aiStatusContent
                  }
                >
                  <Text
                    style={
                      styles.aiStatusTitle
                    }
                  >
                    {validatingPhoto
                      ? 'AI is checking your photo'
                      : aiCanProceed
                        ? 'Photo validated successfully'
                        : aiDecision ===
                            'REJECT'
                          ? 'Photo rejected'
                          : 'Photo verification required'}
                  </Text>

                  <Text
                    style={
                      styles.aiStatusText
                    }
                  >
                    {validatingPhoto
                      ? 'Checking your uploaded e-waste photo...'
                      : aiReason ||
                        'The uploaded photo has been validated.'}
                  </Text>

                  {photoValidation &&
                    !validatingPhoto && (
                      <Text
                        style={
                          styles.aiConfidence
                        }
                      >
                        Confidence:{' '}
                        {aiConfidence != null
                          ? `${Math.round(
                              aiConfidence * 100,
                            )}%`
                          : 'Not available'}
                      </Text>
                    )}
                </View>
              </View>
            )}

            {/* PHOTO REQUIRED */}
            {!photoUri && (
              <View
                style={
                  styles.photoRequiredBox
                }
              >
                <Text
                  style={
                    styles.photoRequiredIcon
                  }
                >
                  !
                </Text>

                <View
                  style={
                    styles.photoRequiredContent
                  }
                >
                  <Text
                    style={
                      styles.photoRequiredTitle
                    }
                  >
                    Photo is mandatory
                  </Text>

                  <Text
                    style={
                      styles.photoRequiredText
                    }
                  >
                    You cannot continue without
                    a photo. The AI service validates
                    the uploaded image before the
                    lot moves to the next step.
                  </Text>
                </View>
              </View>
            )}

            {/* MATERIAL */}
            <View
              style={
                styles.sectionHeadingRow
              }
            >
              <View style={styles.stepNumber}>
                <Text
                  style={
                    styles.stepNumberText
                  }
                >
                  2
                </Text>
              </View>

              <View>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  What did you collect? *
                </Text>

                <Text
                  style={
                    styles.requiredText
                  }
                >
                  Select the closest material
                </Text>
              </View>
            </View>

            <View
              style={
                styles.materialGrid
              }
            >
              {MATERIALS.map((material) => {
                const selected =
                  category === material.id;

                return (
                  <Pressable
                    key={material.id}
                    onPress={() =>
                      handleCategorySelect(
                        material.id,
                      )
                    }
                    style={[
                      styles.materialCard,
                      selected &&
                        styles.materialCardSelected,
                    ]}
                  >
                    {selected && (
                      <View
                        style={
                          styles.selectedCheck
                        }
                      >
                        <Text
                          style={
                            styles.selectedCheckText
                          }
                        >
                          ✓
                        </Text>
                      </View>
                    )}

                    <Text
                      style={
                        styles.materialIcon
                      }
                    >
                      {material.icon}
                    </Text>

                    <Text
                      style={[
                        styles.materialLabel,
                        selected &&
                          styles.materialLabelSelected,
                      ]}
                    >
                      {material.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* WEIGHT */}
            <Field
              label="Approximate weight (kg)"
              placeholder="Example: 5"
              value={weight}
              onChangeText={(value) =>
                setWeight(
                  value.replace(
                    /[^0-9.]/g,
                    '',
                  ),
                )
              }
            />

            {/* NOTES */}
            <Field
              label="Notes (optional)"
              placeholder="Visible damage, model, brand or useful details"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {/* CONTINUE */}
            <Button
              label={
                validatingPhoto
                  ? 'AI checking photo...'
                  : 'Continue to value →'
              }
              onPress={
                continueToStepTwo
              }
            />

            {!photoUri && (
              <Text
                style={
                  styles.blockedHint
                }
              >
                Add a photo to unlock the
                next step
              </Text>
            )}

            {photoUri &&
              !aiCanProceed &&
              !validatingPhoto && (
                <Text
                  style={
                    styles.blockedHint
                  }
                >
                  Complete photo validation
                  before continuing
                </Text>
              )}
          </>
        ) : (
          /* STEP 2 */
          <>

            {/* REVIEW HEADING */}
            <View
              style={
                styles.sectionHeadingRow
              }
            >
              <View style={styles.stepNumber}>
                <Text
                  style={
                    styles.stepNumberText
                  }
                >
                  3
                </Text>
              </View>

              <View>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Review your collection
                </Text>

                <Text
                  style={
                    styles.requiredText
                  }
                >
                  Photo validated • Check details
                  before saving
                </Text>
              </View>
            </View>

            {/* PHOTO PREVIEW */}
            {photoUri && (
              <View
                style={
                  styles.reviewPhotoBox
                }
              >
                <Image
                  source={{
                    uri: photoUri,
                  }}
                  style={
                    styles.reviewPhoto
                  }
                />

                <View
                  style={
                    styles.reviewPhotoBadge
                  }
                >
                  <Text
                    style={
                      styles.reviewPhotoBadgeText
                    }
                  >
                    ✓ PHOTO VALIDATED
                  </Text>
                </View>
              </View>
            )}

            {/* REVIEW */}
            <View
              style={
                styles.reviewCard
              }
            >
              <View
                style={
                  styles.reviewRow
                }
              >
                <Text
                  style={
                    styles.reviewLabel
                  }
                >
                  Material
                </Text>

                <Text
                  style={
                    styles.reviewValue
                  }
                >
                  {selectedMaterial?.icon}{' '}
                  {selectedMaterial?.label}
                </Text>
              </View>

              <View
                style={
                  styles.reviewRow
                }
              >
                <Text
                  style={
                    styles.reviewLabel
                  }
                >
                  Weight
                </Text>

                <Text
                  style={
                    styles.reviewValue
                  }
                >
                  {weight} kg
                </Text>
              </View>

              <View
                style={
                  styles.reviewRow
                }
              >
                <Text
                  style={
                    styles.reviewLabel
                  }
                >
                  Photo validation
                </Text>

                <Text
                  style={[
                    styles.reviewValue,
                    styles.reviewValueSuccess,
                  ]}
                >
                  Passed ✓
                </Text>
              </View>

              <View
                style={
                  styles.reviewRow
                }
              >
                <Text
                  style={
                    styles.reviewLabel
                  }
                >
                  AI confidence
                </Text>

                <Text
                  style={
                    styles.reviewValue
                  }
                >
                  {aiConfidence != null
                    ? `${Math.round(
                        aiConfidence * 100,
                      )}%`
                    : 'Not available'}
                </Text>
              </View>

              {notes.trim().length > 0 && (
                <View
                  style={
                    styles.reviewNotes
                  }
                >
                  <Text
                    style={
                      styles.reviewLabel
                    }
                  >
                    Notes
                  </Text>

                  <Text
                    style={
                      styles.reviewNotesText
                    }
                  >
                    {notes}
                  </Text>
                </View>
              )}
            </View>

            {/* AI VALIDATION */}
            <View
              style={
                styles.aiVerifiedBox
              }
            >
              <View
                style={
                  styles.aiVerifiedIcon
                }
              >
                <Text
                  style={
                    styles.aiVerifiedIconText
                  }
                >
                  ✓
                </Text>
              </View>

              <View
                style={
                  styles.aiContent
                }
              >
                <Text
                  style={
                    styles.aiTitle
                  }
                >
                  Photo validation passed
                </Text>

                <Text
                  style={
                    styles.aiText
                  }
                >
                  The uploaded photo has been
                  successfully validated for this
                  collection record.
                </Text>

                <Text
                  style={
                    styles.aiStatus
                  }
                >
                  AI confidence:{' '}
                  {aiConfidence != null
                    ? `${Math.round(
                        aiConfidence * 100,
                      )}%`
                    : 'Not available'}
                </Text>
              </View>
            </View>

            {/* VALUE */}
            <View
              style={
                styles.valuationCard
              }
            >
              <Text
                style={
                  styles.valuationLabel
                }
              >
                PRELIMINARY VALUE RANGE
              </Text>

              {estimatedRange ? (
                <>
                  <Text
                    style={
                      styles.valuationAmount
                    }
                  >
                    ₹
                    {estimatedRange.low.toLocaleString(
                      'en-IN',
                    )}
                    {' – '}
                    ₹
                    {estimatedRange.high.toLocaleString(
                      'en-IN',
                    )}
                  </Text>

                  <Text
                    style={
                      styles.confidenceText
                    }
                  >
                    Preliminary estimate • Final
                    price depends on recycler
                    verification, material condition
                    and current market rates.
                  </Text>
                </>
              ) : (
                <Text
                  style={
                    styles.confidenceText
                  }
                >
                  Add material and weight to see
                  an estimate.
                </Text>
              )}
            </View>

            {/* SAFETY */}
            <View
              style={
                styles.warningBox
              }
            >
              <Text
                style={
                  styles.warningTitle
                }
              >
                ⚠️ Important
              </Text>

              <Text
                style={
                  styles.warningText
                }
              >
                This is an estimated range, not a
                guaranteed selling price. Hidden
                faults cannot be determined from a
                photo alone. Damaged, swollen or
                burnt batteries should be handled
                carefully and may require verification.
              </Text>
            </View>

            {/* EDIT */}
            <Button
              label="← Edit details"
              variant="secondary"
              onPress={() =>
                setStep(1)
              }
            />

            {/* SAVE */}
            <Button
              label={
                saving
                  ? 'Saving lot...'
                  : 'Save validated lot on this phone'
              }
              onPress={saveLot}
            />

            <Text
              style={
                styles.finalNote
              }
            >
              ✓ Photo validation passed. The lot
              will first be stored offline and
              receive its server reference when
              synchronization is completed.
            </Text>
          </>
        )}
      </Card>

      <Text style={styles.safeNote}>
        🔒 Your lot is stored locally first.
        Photo validation, online sync, recycler
        offers and final valuation are handled
        separately.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  /* =========================
     PROGRESS
  ========================= */

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  step: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.brand,
    letterSpacing: 0.8,
  },

  stepStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 0.5,
  },

  /* =========================
     SECTION
  ========================= */

  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  sectionTitle: {
    ...typography.heading,
    fontSize: 17,
    color: '#10251D',
    marginBottom: 3,
  },

  requiredText: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '600',
  },

  /* =========================
     PHOTO UPLOAD
  ========================= */

  photoBox: {
    height: 220,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.brand,
    borderRadius: 22,
    backgroundColor: '#F4FAF7',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },

  photoBoxFilled: {
    borderStyle: 'solid',
    borderWidth: 0,
    backgroundColor: '#10251D',
  },

  cameraCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E2F4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  cameraIcon: {
    fontSize: 32,
  },

  photoTitle: {
    ...typography.heading,
    fontSize: 18,
    color: '#10251D',
  },

  photoSubtitle: {
    ...typography.body,
    color: colors.brand,
    fontWeight: '800',
    marginTop: 4,
  },

  photoHint: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 7,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 16,
  },

  photoPreview: {
    width: '100%',
    height: '100%',
  },

  photoOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
  },

  photoOverlayText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },

  verifiedPhotoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.brand,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },

  rejectedPhotoBadge: {
    backgroundColor: '#D64545',
  },

  checkingPhotoBadge: {
    backgroundColor: '#356AE6',
  },

  verifiedPhotoText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  /* =========================
     AI STATUS
  ========================= */

  aiStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5FF',
    borderWidth: 1,
    borderColor: '#D9E7FF',
    borderRadius: 17,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  aiStatusChecking: {
    backgroundColor: '#EEF5FF',
    borderColor: '#D9E7FF',
  },

  aiStatusAccepted: {
    backgroundColor: '#EAF8F1',
    borderColor: '#CBEBDD',
  },

  aiStatusRejected: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFD0D0',
  },

  aiStatusIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#356AE6',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 17,
    fontWeight: '900',
    overflow: 'hidden',
  },

  aiStatusContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  aiStatusTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1C428A',
  },

  aiStatusText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#526A91',
    marginTop: 4,
  },

  aiConfidence: {
    fontSize: 10,
    fontWeight: '900',
    color: '#356AE6',
    marginTop: 7,
  },

  /* =========================
     PHOTO REQUIRED
  ========================= */

  photoRequiredBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7E5',
    borderWidth: 1,
    borderColor: '#FFE1A6',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  photoRequiredIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E29A00',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '900',
    marginRight: spacing.sm,
  },

  photoRequiredContent: {
    flex: 1,
  },

  photoRequiredTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#8A5A00',
  },

  photoRequiredText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#8A5A00',
    marginTop: 3,
  },

  /* =========================
     MATERIAL GRID
  ========================= */

  materialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  materialCard: {
    width: '48%',
    minHeight: 96,
    borderWidth: 1,
    borderColor: '#D8E4DF',
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  materialCardSelected: {
    borderWidth: 2,
    borderColor: colors.brand,
    backgroundColor: '#EAF8F1',
    shadowOpacity: 0.08,
    elevation: 4,
  },

  selectedCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  materialIcon: {
    fontSize: 30,
    marginBottom: 6,
  },

  materialLabel: {
    ...typography.body,
    fontWeight: '800',
    color: '#25362F',
  },

  materialLabelSelected: {
    color: colors.brand,
  },

  /* =========================
     REVIEW PHOTO
  ========================= */

  reviewPhotoBox: {
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.md,
    position: 'relative',
    backgroundColor: '#10251D',
  },

  reviewPhoto: {
    width: '100%',
    height: '100%',
  },

  reviewPhotoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.brand,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
  },

  reviewPhotoBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* =========================
     REVIEW CARD
  ========================= */

  reviewCard: {
    backgroundColor: '#F6FAF8',
    borderWidth: 1,
    borderColor: '#DFEAE5',
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E4ECE8',
  },

  reviewLabel: {
    ...typography.body,
    color: colors.muted,
    fontSize: 12,
  },

  reviewValue: {
    ...typography.body,
    fontWeight: '800',
    maxWidth: '58%',
    textAlign: 'right',
    color: '#172B23',
  },

  reviewValueSuccess: {
    color: colors.brand,
  },

  reviewNotes: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },

  reviewNotesText: {
    ...typography.body,
    marginTop: 5,
    lineHeight: 20,
    color: '#263B32',
  },

  /* =========================
     AI VERIFIED
  ========================= */

  aiVerifiedBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EAF8F1',
    borderWidth: 1,
    borderColor: '#CBEBDD',
    borderRadius: 17,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  aiVerifiedIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiVerifiedIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  aiContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  aiTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#146B4D',
  },

  aiText: {
    fontSize: 10,
    lineHeight: 17,
    color: '#3D6C59',
    marginTop: 4,
  },

  aiBold: {
    fontWeight: '900',
    color: '#146B4D',
  },

  aiStatus: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.brand,
    marginTop: 7,
  },

  /* =========================
     VALUATION
  ========================= */

  valuationCard: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.brand,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },

  valuationLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 1,
  },

  valuationAmount: {
    fontSize: 31,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: spacing.xs,
    letterSpacing: -0.5,
  },

  confidenceText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.76)',
    marginTop: spacing.sm,
    lineHeight: 19,
    fontSize: 10,
  },

  /* =========================
     WARNING
  ========================= */

  warningBox: {
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#FFE3AA',
    borderRadius: 17,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  warningTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8A5A00',
    marginBottom: 5,
  },

  warningText: {
    ...typography.body,
    color: '#7A6847',
    lineHeight: 20,
    fontSize: 10,
  },

  /* =========================
     BUTTON HINTS
  ========================= */

  blockedHint: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: spacing.xs,
    lineHeight: 16,
  },

  finalNote: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },

  /* =========================
     SUCCESS
  ========================= */

  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    elevation: 6,
  },

  successIconText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
  },

  savedTitle: {
    ...typography.heading,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: 20,
    color: '#10251D',
  },

  savedText: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    lineHeight: 21,
    textAlign: 'center',
  },

  summaryBox: {
    backgroundColor: '#F5FAF7',
    borderWidth: 1,
    borderColor: '#DCE9E3',
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  summaryLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.muted,
    letterSpacing: 0.8,
    marginTop: spacing.xs,
  },

  summaryValue: {
    ...typography.body,
    fontWeight: '800',
    color: '#193229',
    marginBottom: spacing.xs,
  },

  /* =========================
     BOTTOM NOTE
  ========================= */

  safeNote: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    lineHeight: 20,
    fontSize: 10,
  },
});

