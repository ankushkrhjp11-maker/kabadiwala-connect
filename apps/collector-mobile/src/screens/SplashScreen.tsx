import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { translations } from '../../../../packages/i18n/src';
import { colors } from '../theme';

export function SplashScreen() {
  /* =========================================
     ANIMATION VALUES
  ========================================= */

  const logoScale = useRef(
    new Animated.Value(0.45),
  ).current;

  const logoOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const brandOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const brandY = useRef(
    new Animated.Value(25),
  ).current;

  const taglineOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const taglineY = useRef(
    new Animated.Value(15),
  ).current;

  const descriptionOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const footerOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const ringScale = useRef(
    new Animated.Value(0.8),
  ).current;

  const arrowRotation = useRef(
    new Animated.Value(0),
  ).current;

  /* =========================================
     START ANIMATION
  ========================================= */

  useEffect(() => {
    Animated.sequence([
      /* =====================================
         LOGO
      ===================================== */

      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 55,
          useNativeDriver: true,
        }),

        Animated.timing(ringScale, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),

      /* =====================================
         BRAND NAME
      ===================================== */

      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(brandY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      /* =====================================
         TAGLINE
      ===================================== */

      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(taglineY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      /* =====================================
         DESCRIPTION
      ===================================== */

      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      /* =====================================
         FOOTER
      ===================================== */

      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      /* =====================================
         RECYCLING ARROWS
      ===================================== */

      Animated.timing(arrowRotation, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    logoScale,
    logoOpacity,
    brandOpacity,
    brandY,
    taglineOpacity,
    taglineY,
    descriptionOpacity,
    footerOpacity,
    ringScale,
    arrowRotation,
  ]);

  const arrowRotate = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-25deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      {/* =================================
          BACKGROUND DECORATION
      ================================= */}

      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />
      <View style={styles.smallCircleOne} />
      <View style={styles.smallCircleTwo} />

      {/* =================================
          CENTER CONTENT
      ================================= */}

      <View style={styles.content}>
        {/* =================================
            LOGO
        ================================= */}

        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        >
          <View style={styles.logoOuter}>
            {/* Outer ring */}

            <Animated.View
              style={[
                styles.logoRing,
                {
                  transform: [
                    {
                      scale: ringScale,
                    },
                  ],
                },
              ]}
            />

            {/* Main logo */}

            <View style={styles.logoInner}>
              <Text style={styles.logoK}>
                K
              </Text>

              {/* Green leaves */}

              <View style={styles.leafOne} />
              <View style={styles.leafTwo} />
            </View>

            {/* =================================
                RECYCLING ARROWS
            ================================= */}

            <Animated.View
              style={[
                styles.arrow,
                styles.arrowOne,
                {
                  transform: [
                    {
                      rotate: arrowRotate,
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.arrowText}>
                ↗
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.arrow,
                styles.arrowTwo,
                {
                  transform: [
                    {
                      rotate: arrowRotate,
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.arrowText}>
                ↘
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.arrow,
                styles.arrowThree,
                {
                  transform: [
                    {
                      rotate: arrowRotate,
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.arrowText}>
                ↙
              </Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* =================================
            APP NAME
        ================================= */}

        <Animated.View
          style={{
            opacity: brandOpacity,
            transform: [
              {
                translateY: brandY,
              },
            ],
          }}
        >
          <Text style={styles.appName}>
            {translations.en.appName}
          </Text>
        </Animated.View>

        {/* =================================
            TAGLINE
        ================================= */}

        <Animated.View
          style={{
            opacity: taglineOpacity,
            transform: [
              {
                translateY: taglineY,
              },
            ],
          }}
        >
          <Text style={styles.tagline}>
            Saaf kaam. Behtar daam.
          </Text>
        </Animated.View>

        {/* =================================
            DESCRIPTION
        ================================= */}

        <Animated.Text
          style={[
            styles.description,
            {
              opacity: descriptionOpacity,
            },
          ]}
        >
          Connecting collectors with
          responsible recycling.
        </Animated.Text>

        {/* =================================
            STATUS
        ================================= */}

        <Animated.View
          style={[
            styles.status,
            {
              opacity: descriptionOpacity,
            },
          ]}
        >
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            Building a cleaner tomorrow
          </Text>
        </Animated.View>
      </View>

      {/* =================================
          FOOTER
      ================================= */}

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: footerOpacity,
          },
        ]}
      >
        <View style={styles.footerLine} />

        <Text style={styles.footerText}>
          ♻  RECYCLE • CONNECT • GROW
        </Text>

        <Text style={styles.footerBrand}>
          KABADIWALA CONNECT
        </Text>
      </Animated.View>
    </View>
  );
}

/* =========================================
   STYLES
========================================= */

const styles = StyleSheet.create({
  /* =====================================
     MAIN
  ===================================== */

  container: {
    flex: 1,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /* =====================================
     BACKGROUND
  ===================================== */

  circleTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -155,
    right: -125,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  circleBottom: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    bottom: -220,
    left: -180,
    backgroundColor: 'rgba(255,255,255,0.055)',
  },

  smallCircleOne: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: '24%',
    left: -80,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },

  smallCircleTwo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: '26%',
    right: -95,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },

  /* =====================================
     CONTENT
  ===================================== */

  content: {
    alignItems: 'center',
    paddingHorizontal: 28,
    marginTop: -35,
  },

  /* =====================================
     LOGO
  ===================================== */

  logoWrapper: {
    marginBottom: 28,
  },

  logoOuter: {
    width: 145,
    height: 145,
    borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.11)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  logoRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  logoInner: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },

  logoK: {
    fontSize: 59,
    fontWeight: '900',
    color: colors.brand,
    letterSpacing: -4,
    marginTop: -3,
  },

  /* =====================================
     LEAVES
  ===================================== */

  leafOne: {
    position: 'absolute',
    width: 15,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#62C996',
    right: 16,
    top: 23,
    transform: [
      {
        rotate: '-35deg',
      },
    ],
  },

  leafTwo: {
    position: 'absolute',
    width: 13,
    height: 7,
    borderRadius: 10,
    backgroundColor: '#8EDCB8',
    left: 17,
    bottom: 22,
    transform: [
      {
        rotate: '35deg',
      },
    ],
  },

  /* =====================================
     ARROWS
  ===================================== */

  arrow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowOne: {
    top: -7,
    left: 11,
  },

  arrowTwo: {
    right: -4,
    top: 47,
  },

  arrowThree: {
    bottom: -1,
    left: 4,
  },

  arrowText: {
    color: '#DDF5EC',
    fontSize: 18,
    fontWeight: '900',
  },

  /* =====================================
     BRAND
  ===================================== */

  appName: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.8,
  },

  tagline: {
    color: '#DDF5EC',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 9,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  description: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 12,
    maxWidth: 285,
    textAlign: 'center',
  },

  /* =====================================
     STATUS
  ===================================== */

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#8FE0B9',
    marginRight: 7,
  },

  statusText: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* =====================================
     FOOTER
  ===================================== */

  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },

  footerLine: {
    width: 65,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 11,
  },

  footerText: {
    color: 'rgba(255,255,255,0.67)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  footerBrand: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: 6,
  },
});