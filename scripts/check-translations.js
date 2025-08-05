#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to get all keys from a nested object
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Function to get value by dot notation
function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Main function
function checkTranslations() {
  const localesDir = path.join(__dirname, '../src/i18n/locales');
  const files = ['en.json', 'es.json', 'fr.json', 'pt.json'];
  
  console.log('🔍 Checking translation files for missing keys...\n');
  
  // Read all translation files
  const translations = {};
  for (const file of files) {
    const filePath = path.join(localesDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      translations[file] = JSON.parse(content);
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error.message);
      return;
    }
  }
  
  // Get all keys from English (reference)
  const englishKeys = getAllKeys(translations['en.json']);
  console.log(`📊 English file has ${englishKeys.length} keys\n`);
  
  // Check each language file
  for (const [lang, langFile] of Object.entries(translations)) {
    if (lang === 'en.json') continue;
    
    console.log(`\n🌐 Checking ${lang}:`);
    const langKeys = getAllKeys(langFile);
    const missingKeys = englishKeys.filter(key => !langKeys.includes(key));
    
    if (missingKeys.length === 0) {
      console.log(`✅ All keys present (${langKeys.length} keys)`);
    } else {
      console.log(`❌ Missing ${missingKeys.length} keys:`);
      missingKeys.forEach(key => {
        const value = getValueByPath(translations['en.json'], key);
        console.log(`   - ${key}: "${value}"`);
      });
    }
    
    // Check for extra keys
    const extraKeys = langKeys.filter(key => !englishKeys.includes(key));
    if (extraKeys.length > 0) {
      console.log(`⚠️  Extra keys found (${extraKeys.length}):`);
      extraKeys.forEach(key => {
        const value = getValueByPath(langFile, key);
        console.log(`   - ${key}: "${value}"`);
      });
    }
  }
  
  console.log('\n📋 Summary:');
  console.log(`- English: ${englishKeys.length} keys`);
  for (const [lang, langFile] of Object.entries(translations)) {
    if (lang === 'en.json') continue;
    const langKeys = getAllKeys(langFile);
    const missingKeys = englishKeys.filter(key => !langKeys.includes(key));
    console.log(`- ${lang}: ${langKeys.length} keys (${missingKeys.length} missing)`);
  }
}

// Run the check
checkTranslations(); 