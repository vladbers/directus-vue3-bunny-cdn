<template>
  <div id="bunny-upload-directus">
    <div class="loader" v-if="uploadProgress">
      <div>Uploading file to Bunny CDN please wait...</div>
    </div>
    
    <div class="upload-container">
      <label :for="uniqueId" class="custom-file-upload">
        <v-icon name="upload" left />
        Upload file to Bunny CDN
      </label>
      <input
        :id="uniqueId"
        type="file"
        multiple
        style="display: none;"
        @change="handleFileInput(($event.target as HTMLInputElement).files)"
      />
      
      <div class="file-info" v-if="fileNames.length > 0">
        <v-icon name="description" />
        <ul>
          <li v-for="name in fileNames" :key="name" class="file-name">{{ name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, inject } from "vue";
import { nanoid } from 'nanoid';

const props = defineProps({
  folder: {
    type: String,
    default: '',
  },
  collection_as_subfolder: {
    type: Boolean,
    default: true,
  },
  value: {
    type: String,
    default: null,
  },
  collection: {
    type: String,
    default: null,
  },
  primaryKey: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(['input']);

const apiUrl = ref('__CDN_API_URL__');
const apiKey = ref('__CDN_API_KEY__');
const apiGetUrl = ref('__CDN_API_GET_URL__');

const fileNames = ref<string[]>([]);
const uploadProgress = ref(false);
const uniqueId = ref('');

// Добавляем функцию для получения ID
const getCurrentItemId = () => {
  // Пытаемся получить primaryKey из props
  if (props.primaryKey && props.primaryKey !== '+') {
    console.log('Using primaryKey from props:', props.primaryKey);
    return props.primaryKey;
  }
  
  // Пробуем извлечь ID из URL
  try {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    // URL формата /admin/content/CollectionName/ID
    // ID будет последней частью URL
    const possibleId = pathParts[pathParts.length - 1];
    
    if (possibleId && !isNaN(Number(possibleId))) {
      console.log('Extracted ID from URL:', possibleId);
      return possibleId;
    }
  } catch (error) {
    console.error('Error extracting ID from URL:', error);
  }
  
  // Если не получилось, возвращаем пустую строку или null
  return null;
};

// Получаем ID документа
const itemId = getCurrentItemId();

// Формируем путь в нужном формате: /data-model-name/id-document
let folder = '';

if (props.collection) {
  folder = props.collection; // data-model-name
  
  if (itemId) {
    folder = `${folder}/${itemId}`; // data-model-name/id-document
  } else {
    console.warn('Не удалось получить ID документа');
  }
}

// Если есть параметр folder из настроек, добавляем его в начало
if (props.folder) {
  folder = props.folder + (folder ? `/${folder}` : '');
}

console.log('Folder path:', folder);
console.log('Collection:', props.collection);
console.log('Item ID:', itemId);

const toggleProgress = () => uploadProgress.value = !uploadProgress.value;

const getFileExtension = (filename: string): string => {
  if (!filename || typeof filename !== 'string') return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop() || '' : '';
};

const setFileNamesFromValue = (value: string | null) => {
  if (!value) {
    fileNames.value = [];
    return;
  }
  try {
    const urls = JSON.parse(value);
    if (Array.isArray(urls)) {
      fileNames.value = urls.map(url => {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
      });
    } else {
      // Handle single string value for backward compatibility
      const urlParts = value.split('/');
      fileNames.value = [urlParts[urlParts.length - 1]];
    }
  } catch (error) {
    // If parsing fails, assume it's a single URL (old format)
    try {
      const urlParts = value.split('/');
      fileNames.value = [urlParts[urlParts.length - 1]];
    } catch (e) {
      console.error('Ошибка при извлечении имени файла:', e);
      fileNames.value = [];
    }
  }
};

/**
 * @param fileName
 * @returns {string}
 */
const generateFileName = (fileName: string): string => {
  // Транслитерация кириллицы (если это нужно)
  const transliterate = (text: string): string => {
    const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const en = 'abvgdeejzijklmnoprstufhzcssyye';
    return text.split('').map(char => {
      const lower = char.toLowerCase();
      const index = ru.indexOf(lower);
      return index >= 0 ? (char === lower ? en[index] : en[index].toUpperCase()) : char;
    }).join('');
  };
  
  // Преобразуем имя файла - транслитерация, нижний регистр, замена пробелов и спецсимволов
  return transliterate(String(fileName))
    .toLowerCase()
    .replace(/[^\w\-]/g, '_') // Заменяем все символы кроме букв, цифр, - и _ на подчеркивание
    .replace(/_{2,}/g, '_'); // Заменяем повторяющиеся подчеркивания на одно
};

/**
 * @param publicId
 * @param timestamp
 * @returns {string}
 */
const generateSignature = (publicId: string, timestamp: string): string => {
  // Генерируем короткий хеш (6-8 символов достаточно)
  const random = Math.random().toString(36).substring(2, 6);
  const timestamp2 = Date.now().toString(36).substring(0, 4);
  return random + timestamp2;
};

/**
 * @param id
 * @param body
 * @returns {Promise<string>}
 */
async function send(id: string, body: File): Promise<string> {
  toggleProgress();
  const url = folder ? `${apiUrl.value}/${folder}/${id}` : `${apiUrl.value}/${id}`;
  const key = apiKey.value;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: body,
      headers: {  
        'content-type': 'application/octet-stream',
        AccessKey: key
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    toggleProgress();
    return folder ? `${apiGetUrl.value}/${folder}/${id}` : `${apiGetUrl.value}/${id}`;
  } catch (error) {
    toggleProgress();
    console.error('Error uploading to Bunny CDN:', error);
    throw error;
  }
}

/**
 * Обработчик выбора файла
 */
async function handleFileInput(files: FileList | null) {
  if (files && files.length > 0) {
    const uploadedUrls: string[] = [];
    // Сбрасываем fileNames перед загрузкой новых файлов
    fileNames.value = []; 

    for (const file of Array.from(files)) {
      try {
        const originalFileName = file.name;
        
        // Получаем имя файла без расширения
        const nameParts = originalFileName.split('.');
        const extension = nameParts.pop() || '';
        const nameWithoutExt = nameParts.join('.');
        
        // Форматируем имя файла (без расширения)
        const formattedName = generateFileName(nameWithoutExt);
        
        const timestamp = (new Date()).getTime().toString();
        const hash = generateSignature(formattedName, timestamp);
        
        // Создаем имя файла в формате "name-hash.extension"
        const id = `${formattedName}-${hash}.${extension}`;
        
        fileNames.value.push(id); // Добавляем имя файла в список для отображения
        
        const url = await send(id, file);
        uploadedUrls.push(url);
      } catch (error) {
        console.error('Ошибка при обработке файла:', error);
        // Удаляем имя файла из списка, если загрузка не удалась
        const failedFileName = fileNames.value.pop(); 
        console.warn(`Файл ${failedFileName} не был загружен.`);
      }
    }
    if (uploadedUrls.length > 0) {
      emit('input', JSON.stringify(uploadedUrls));
    }
  }
}

watchEffect(() => {
  if (props.value) {
    setFileNamesFromValue(props.value);
  }
});

onMounted(() => {
  uniqueId.value = `file-upload-${nanoid(5)}`;
  if (props.value) {
    setFileNamesFromValue(props.value);
  }
});
</script>

<style>
#bunny-upload-directus {
  width: 100%;
  padding: 20px;
  border: 1px solid var(--v-input-border-color-hover, var(--theme--form--field--input--border-color-hover));
  border-radius: 10px;
  position: relative;
}

#bunny-upload-directus .upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Стилизация кнопки загрузки */
#bunny-upload-directus .custom-file-upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--theme--primary);
  color: var(--theme--primary-background);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  width: fit-content;
}

#bunny-upload-directus .custom-file-upload:hover {
  background-color: var(--theme--primary-accent);
}

#bunny-upload-directus .file-info {
  margin-top: 10px;
  padding: 10px;
  background: var(--theme--form--field--input--background);
  border-radius: 5px;
  border: 1px solid var(--v-input-border-color-hover, var(--theme--form--field--input--border-color-hover));
  display: flex;
  align-items: center;
  gap: 10px;
}

#bunny-upload-directus .file-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

#bunny-upload-directus .file-info li {
  margin-bottom: 5px;
}

#bunny-upload-directus .file-name {
  font-weight: 500;
  word-break: break-all;
}

#bunny-upload-directus .loader {
  background: var(--theme--form--field--input--background);
  text-align: center;
  position: absolute;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--v-input-color);
}
</style>