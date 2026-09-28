import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly aiServiceUrl =
    process.env.AI_SERVICE_URL ?? 'http://127.0.0.1:8000';

  async validateImage(
    file: Express.Multer.File,
    selectedCategory: string,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Image file is required',
      );
    }

    const category = selectedCategory?.trim();

    if (!category) {
      throw new BadRequestException(
        'Material category is required',
      );
    }

    const formData = new FormData();

    const arrayBuffer = new ArrayBuffer(
      file.buffer.byteLength,
    );

    new Uint8Array(arrayBuffer).set(file.buffer);

    const imageBlob = new Blob([arrayBuffer], {
      type: file.mimetype,
    });

    formData.append(
      'file',
      imageBlob,
      file.originalname,
    );

    formData.append(
      'selected_category',
      category,
    );

    let response: Response;

    try {
      response = await fetch(
        `${this.aiServiceUrl}/validate-image`,
        {
          method: 'POST',
          body: formData,
        },
      );
    } catch (error) {
      console.error(
        '[AI] Python service connection failed:',
        error,
      );

      throw new ServiceUnavailableException(
        'AI service is unavailable. Verification Required.',
      );
    }

    const responseText = await response.text();

    let data: unknown;

    try {
      data = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      throw new ServiceUnavailableException(
        'Invalid response from AI service.',
      );
    }

    if (!response.ok) {
      console.error(
        '[AI] Python service error:',
        response.status,
        data,
      );

      throw new ServiceUnavailableException(
        'AI analysis failed. Verification Required.',
      );
    }

    return data;
  }
}