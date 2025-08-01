#!/usr/bin/env node

/**
 * Design System Audit Script
 * Scans the codebase for violations of the Rarity Leads design system rules
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Forbidden patterns to check
const FORBIDDEN_PATTERNS = {
  gradients: [
    /bg-gradient/,
    /from-.*to-.*/,
    /gradient-to/,
  ],
  glassMorphism: [
    /backdrop-filter/,
    /backdrop-blur/,
    /blur\[/,
  ],
  excessiveFontWeights: [
    /font-semibold/,
    /font-bold/,
    /font-extrabold/,
    /font-black/,
  ],
  colorfulBackgrounds: [
    /bg-white/,
    /bg-light/,
    /bg-yellow/,
    /bg-green/,
    /bg-blue/,
    /bg-pink/,
    /bg-red/,
    /bg-orange/,
  ],
  excessiveShadows: [
    /shadow-xl/,
    /shadow-2xl/,
    /shadow-purple/,
    /shadow-.*\/.*/,
  ],
};

// Files to scan
const SCAN_PATTERNS = [
  'src/**/*.{tsx,ts,jsx,js}',
  '!src/**/*.d.ts',
  '!node_modules/**',
  '!dist/**',
  '!build/**',
];

// Results storage
const violations = {
  gradients: [],
  glassMorphism: [],
  excessiveFontWeights: [],
  colorfulBackgrounds: [],
  excessiveShadows: [],
};

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, lineNumber) => {
    const lineNum = lineNumber + 1;
    
    // Check each pattern
    Object.entries(FORBIDDEN_PATTERNS).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        if (pattern.test(line)) {
          violations[category].push({
            file: filePath,
            line: lineNum,
            content: line.trim(),
            pattern: pattern.toString(),
          });
        }
      });
    });
  });
}

function printResults() {
  console.log('🎨 Rarity Leads Design System Audit\n');
  
  let totalViolations = 0;
  let hasViolations = false;
  
  Object.entries(violations).forEach(([category, items]) => {
    if (items.length > 0) {
      hasViolations = true;
      totalViolations += items.length;
      
      console.log(`❌ ${category.toUpperCase()} (${items.length} violations):`);
      items.forEach(item => {
        console.log(`   ${item.file}:${item.line} - ${item.content.substring(0, 80)}...`);
      });
      console.log('');
    }
  });
  
  if (!hasViolations) {
    console.log('✅ No design system violations found!');
  } else {
    console.log(`📊 Total violations: ${totalViolations}`);
    console.log('\n🔧 To fix these violations:');
    console.log('1. Replace gradients with solid colors (bg-rarity-600, bg-dark-bg, etc.)');
    console.log('2. Remove backdrop-filter and blur effects');
    console.log('3. Use only font-medium (500) or font-normal (400)');
    console.log('4. Use only dark theme colors');
    console.log('5. Use minimal shadows (shadow-sm)');
  }
}

function main() {
  console.log('🔍 Scanning codebase for design system violations...\n');
  
  // Scan all files
  SCAN_PATTERNS.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(file => {
      scanFile(file);
    });
  });
  
  printResults();
  
  // Exit with error code if violations found
  const hasViolations = Object.values(violations).some(items => items.length > 0);
  process.exit(hasViolations ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { violations, scanFile }; 