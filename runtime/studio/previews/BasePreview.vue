<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'
import getPrefixName from '#dd/utils/getPrefixName'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

function getCssVarDecl(fieldPath: string) {
  return getPrefixName(fieldPath.replaceAll('.', '-'), { type: 'css-var-decl' })
}

const radiusTokens = [
  { label: 'Radius None', fieldPath: 'border-radius.none', value: '0' },
  { label: 'Radius SM', fieldPath: 'border-radius.sm', value: '0.125rem' },
  { label: 'Radius Base', fieldPath: 'border-radius.base', value: '0.25rem' },
  { label: 'Radius MD', fieldPath: 'border-radius.md', value: '0.375rem' },
  { label: 'Radius LG', fieldPath: 'border-radius.lg', value: '0.5rem' },
  { label: 'Radius XL', fieldPath: 'border-radius.xl', value: '0.75rem' },
  { label: 'Radius Full', fieldPath: 'border-radius.full', value: '9999px' }
].map((t) => ({ ...t, path: getCssVarDecl(t.fieldPath) }))

const spaceTokens = [
  { label: 'Tiny', fieldPath: 'space.tiny' },
  { label: 'XXS', fieldPath: 'space.xxs' },
  { label: 'XS', fieldPath: 'space.xs' },
  { label: 'SM', fieldPath: 'space.sm' },
  { label: 'MD', fieldPath: 'space.md' },
  { label: 'LG', fieldPath: 'space.lg' },
  { label: 'XL', fieldPath: 'space.xl' },
  { label: 'SL', fieldPath: 'space.sl' },
  { label: 'UL', fieldPath: 'space.ul' }
].map((t) => ({ ...t, path: getCssVarDecl(t.fieldPath) }))

const borderWidthTokens = [
  { label: 'None', fieldPath: 'border-width.none' },
  { label: 'SM', fieldPath: 'border-width.sm' },
  { label: 'MD', fieldPath: 'border-width.md' },
  { label: 'LG', fieldPath: 'border-width.lg' }
].map((t) => ({ ...t, path: getCssVarDecl(t.fieldPath) }))

const zIndexTokens = [
  { label: '1', fieldPath: 'z-index.1' },
  { label: '2', fieldPath: 'z-index.2' },
  { label: '3', fieldPath: 'z-index.3' },
  { label: '4', fieldPath: 'z-index.4' },
  { label: '5', fieldPath: 'z-index.5' },
  { label: '6', fieldPath: 'z-index.6' },
  { label: '7', fieldPath: 'z-index.7' },
  { label: '8', fieldPath: 'z-index.8' },
  { label: '9', fieldPath: 'z-index.9' }
].map((t) => ({ ...t, path: getCssVarDecl(t.fieldPath) }))

const transitionTokens = [
  { label: 'Fast', fieldPath: 'transition.fast' },
  { label: 'Base', fieldPath: 'transition.base' },
  { label: 'Slow', fieldPath: 'transition.slow' }
].map((t) => ({ ...t, path: getCssVarDecl(t.fieldPath) }))

const shadowTokens = [
  { label: 'SM', fieldPath: 'shadow.sm' },
  { label: 'MD', fieldPath: 'shadow.md' },
  { label: 'LG', fieldPath: 'shadow.lg' },
  { label: 'XL', fieldPath: 'shadow.xl' },
  { label: 'Inner', fieldPath: 'shadow.inner' },
  { label: 'None', fieldPath: 'shadow.none' }
].map((t) => ({ ...t, path: getCssVarDecl(t.fieldPath) }))

const colorFamilies = [
  'primary', 'secondary', 'gray', 'accent', 'success', 'warning', 'danger', 'error', 'info'
].map((name) => ({
  label: name.charAt(0).toUpperCase() + name.slice(1),
  tokens: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
    .map((step) => {
      const fieldPath = `color.${name}.${step}`
      return {
        label: step,
        fieldPath,
        path: getCssVarDecl(fieldPath)
      }
    })
}))

const paletteContrastThresholds: Record<string, number> = {
  Primary: 400,
  Secondary: 500,
  Gray: 500,
  Accent: 500,
  Success: 400,
  Warning: 500,
  Danger: 400,
  Error: 400,
  Info: 400
}

function paletteLabelColor(family: string, step: string) {
  const threshold = paletteContrastThresholds[family] ?? 400
  return Number(step) <= threshold ? '#475569' : '#f8fafc'
}

const semanticColorGroups = [
  {
    label: 'Semantic aliases',
    description: 'Direct semantic entry points',
    fullWidth: true,
    wideGrid: true,
    tokens: [
      { label: 'Primary', fieldPath: 'color.primary' },
      { label: 'Secondary', fieldPath: 'color.secondary' },
      { label: 'Accent', fieldPath: 'color.accent' },
      { label: 'Success', fieldPath: 'color.success' },
      { label: 'Danger', fieldPath: 'color.danger' },
      { label: 'Error', fieldPath: 'color.error' },
      { label: 'Info', fieldPath: 'color.info' },
      { label: 'Warning', fieldPath: 'color.warning' }
    ].map((token) => ({ ...token, path: getCssVarDecl(token.fieldPath) }))
  },
  {
    label: 'Neutrals',
    description: 'Gray scale and borders',
    tokens: [
      { label: 'Gray', fieldPath: 'color.gray' },
      { label: 'Dark Gray', fieldPath: 'color.dark-gray' },
      { label: 'Darker Gray', fieldPath: 'color.darker-gray' },
      { label: 'Light Gray', fieldPath: 'color.light-gray' },
      { label: 'Border Default', fieldPath: 'color.border.default' },
      { label: 'Border Hover', fieldPath: 'color.border.hover' }
    ].map((token) => ({ ...token, path: getCssVarDecl(token.fieldPath) }))
  },
  {
    label: 'Surfaces',
    description: 'Base canvas and text colors',
    tokens: [
      { label: 'Surface', fieldPath: 'color.bg.surface' },
      { label: 'Surface Hover', fieldPath: 'color.bg.surface-hover' },
      { label: 'Text Default', fieldPath: 'color.text.default' },
      { label: 'Background Disabled', fieldPath: 'color.bg.disabled' }
    ].map((token) => ({ ...token, path: getCssVarDecl(token.fieldPath) }))
  }
]

function focusField(path: string) {
  previewContext?.focusField(path)
}

function tokenColor(fieldPath: string, cssVarPath: string) {
  return previewContext?.resolveFieldValue(fieldPath) || `var(${cssVarPath})`
}

function tokenValue(fieldPath: string, fallback: string) {
  return previewContext?.resolveFieldValue(fieldPath) || fallback
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Primitive tokens</h2>
      <p>The base tab now reflects global primitives directly, using abstract previews instead of component previews.</p>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Color</h3>
      <div class="dd-base-color-grid">
        <article
          v-for="family in colorFamilies"
          :key="family.label"
          class="dd-base-surface-card"
        >
          <header>
            <strong>{{ family.label }}</strong>
            <span>Palette ramp</span>
          </header>
          <div class="dd-base-palette">
            <button
              v-for="token in family.tokens"
              :key="token.path"
              type="button"
              class="dd-base-palette-swatch"
              :style="{ background: tokenColor(token.fieldPath, token.path) }"
              :title="`Edit ${token.fieldPath}`"
              @click="focusField(token.fieldPath)"
            >
              <span
                :style="{
                  color: paletteLabelColor(family.label, token.label)
                }"
              >
                {{ token.label }}
              </span>
            </button>
          </div>
        </article>

        <article
          v-for="group in semanticColorGroups"
          :key="group.label"
          class="dd-base-surface-card"
          :class="{
            'dd-base-surface-card-full': group.fullWidth
          }"
        >
          <header>
            <strong>{{ group.label }}</strong>
            <span>{{ group.description }}</span>
          </header>
          <div
            class="dd-base-semantic-grid"
            :class="{ 'dd-base-semantic-grid-wide': group.wideGrid }"
          >
            <button
              v-for="token in group.tokens"
              :key="token.path"
              type="button"
              class="dd-base-semantic-chip"
              :title="`Edit ${token.fieldPath}`"
              @click="focusField(token.fieldPath)"
            >
              <span
                class="dd-base-semantic-dot"
                :style="{ background: tokenColor(token.fieldPath, token.path) }"
              />
              <div>
                <strong>{{ token.label }}</strong>
                <code>{{ token.path.replace(/^--[^-]+-/, '') }}</code>
              </div>
            </button>
          </div>
        </article>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Radius</h3>
      <div class="dd-base-token-grid">
        <button
          v-for="token in radiusTokens"
          :key="token.path"
          type="button"
          class="dd-base-token-card"
          :title="`Edit ${token.fieldPath}`"
          @click="focusField(token.fieldPath)"
        >
          <div
            class="dd-base-radius-shape"
            :style="{ borderRadius: `var(${token.path})` }"
          />
          <strong>{{ token.label }}</strong>
          <code>{{ tokenValue(token.fieldPath, token.value) }}</code>
        </button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Space</h3>
      <div class="dd-base-token-grid">
        <button
          v-for="token in spaceTokens"
          :key="token.path"
          type="button"
          class="dd-base-token-card"
          :title="`Edit ${token.fieldPath}`"
          @click="focusField(token.fieldPath)"
        >
          <div class="dd-base-space-sample">
            <div
              class="dd-base-space-bar"
              :style="{ width: `var(${token.path})` }"
            />
          </div>
          <strong>{{ token.label }}</strong>
          <code>{{ tokenValue(token.fieldPath, token.path.replace(/^--[^-]+-/, '')) }}</code>
        </button>
      </div>
    </div>

    <div class="dd-base-two-col">
      <div class="dd-studio-preview-block">
        <h3>Border Width</h3>
        <div class="dd-base-token-grid">
          <button
            v-for="token in borderWidthTokens"
            :key="token.path"
            type="button"
            class="dd-base-token-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <div
              class="dd-base-border-sample"
              :style="{ borderWidth: `var(${token.path})` }"
            />
            <strong>{{ token.label }}</strong>
            <code>{{ tokenValue(token.fieldPath, token.path.replace(/^--[^-]+-/, '')) }}</code>
          </button>
        </div>
      </div>

      <div class="dd-studio-preview-block">
        <h3>Shadow</h3>
        <div class="dd-base-token-grid">
          <button
            v-for="token in shadowTokens"
            :key="token.path"
            type="button"
            class="dd-base-token-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <div
              class="dd-base-shadow-sample"
              :style="{ boxShadow: `var(${token.path})` }"
            />
            <strong>{{ token.label }}</strong>
            <code>{{ tokenValue(token.fieldPath, token.path.replace(/^--[^-]+-/, '')) }}</code>
          </button>
        </div>
      </div>
    </div>

    <div class="dd-base-two-col">
      <div class="dd-studio-preview-block">
        <h3>Transition</h3>
        <div class="dd-base-token-grid">
          <button
            v-for="token in transitionTokens"
            :key="token.path"
            type="button"
            class="dd-base-token-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <div
              class="dd-base-motion-sample"
              :style="{ [getCssVarDecl('base.motion-duration')]: `var(${token.path})` }"
            >
              <span />
            </div>
            <strong>{{ token.label }}</strong>
            <code>{{ tokenValue(token.fieldPath, token.path.replace(/^--[^-]+-/, '')) }}</code>
          </button>
        </div>
      </div>

      <div class="dd-studio-preview-block">
        <h3>Z-Index</h3>
        <div class="dd-base-token-grid">
          <button
            v-for="token in zIndexTokens"
            :key="token.path"
            type="button"
            class="dd-base-token-card"
            :title="`Edit ${token.fieldPath}`"
            @click="focusField(token.fieldPath)"
          >
            <div class="dd-base-z-stack">
              <span class="dd-base-z-layer dd-base-z-layer-back">10</span>
              <span
                class="dd-base-z-layer dd-base-z-layer-front"
                :style="{ zIndex: `var(${token.path})` }"
              >
                {{ token.label }}
              </span>
            </div>
            <strong>Layer {{ token.label }}</strong>
            <code>{{ tokenValue(token.fieldPath, token.path.replace(/^--[^-]+-/, '')) }}</code>
          </button>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Layout</h3>
      <button
        type="button"
        class="dd-base-surface-card dd-base-surface-card-button"
        title="Edit max-width"
        @click="focusField('max-width')"
      >
        <header>
          <strong>Max Width</strong>
          <span>Content boundary sample</span>
        </header>
        <div class="dd-base-max-width-stage">
          <div class="dd-base-max-width-outer">
            <div class="dd-base-max-width-inner" />
          </div>
        </div>
        <code>{{ tokenValue('max-width', 'max-width') }}</code>
      </button>
    </div>
  </section>
</template>

<style scoped>
.dd-base-color-grid,
.dd-base-two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.dd-base-surface-card,
.dd-base-token-card {
  border: 1px solid v('color.border.default', 'rgba(148 163 184 / 0.2)');
  border-radius: 16px;
  background: v('color.bg.surface', '#ffffff');
  color: v('color.text.default', 'inherit');
}

.dd-base-token-card,
.dd-base-surface-card-button {
  border: 1px solid v('color.border.default', 'rgba(148 163 184 / 0.2)');
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.dd-base-surface-card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dd-base-surface-card-full {
  grid-column: 1 / -1;
}

.dd-base-surface-card header,
.dd-base-token-card {
  display: flex;
  flex-direction: column;
}

.dd-base-surface-card header {
  gap: 0.2rem;
}

.dd-base-surface-card strong,
.dd-base-token-card strong {
  color: v('color.text.default', 'inherit');
  font-size: 0.9rem;
}

.dd-base-surface-card span {
  color: v('color.text.muted', 'inherit');
  font-size: 0.78rem;
}

.dd-base-palette {
  display: grid;
  grid-template-columns: repeat(11, minmax(0, 1fr));
  gap: 0.45rem;
}

.dd-base-palette-swatch {
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border: none;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(255 255 255 / 0.18);
}

.dd-base-palette-swatch span {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 1px rgba(255 255 255 / 0.22);
}

.dd-base-palette-swatch:focus-visible,
.dd-base-semantic-chip:focus-visible,
.dd-base-token-card:focus-visible,
.dd-base-surface-card-button:focus-visible {
  outline: 2px solid rgba(47 155 143 / 0.45);
  outline-offset: 2px;
}

.dd-base-semantic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.65rem;
}

.dd-base-semantic-grid-wide {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.dd-base-semantic-chip {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-block-size: 4rem;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  background: v('color.bg.surface-subtle', v('color.bg.surface', 'rgba(255 255 255 / 0.7)'));
  border: 1px solid v('color.border.default', 'rgba(148 163 184 / 0.2)');
  color: v('color.text.default', 'inherit');
  cursor: pointer;
  text-align: left;
}

.dd-base-semantic-dot {
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 999px;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(15 23 42 / 0.1);
}

.dd-base-semantic-chip strong,
.dd-base-semantic-chip code,
.dd-base-token-card code,
.dd-base-surface-card code {
  display: block;
}

.dd-base-semantic-chip code,
.dd-base-token-card code,
.dd-base-surface-card code {
  margin-top: 0.2rem;
  color: v('color.text.muted', 'inherit');
  font-size: 0.68rem;
  word-break: break-word;
}

.dd-base-semantic-chip > div {
  min-inline-size: 0;
}

.dd-base-semantic-chip strong {
  line-height: 1.2;
}

.dd-base-semantic-chip code {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1180px) {
  .dd-base-semantic-grid-wide {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.dd-base-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.85rem;
}

.dd-base-token-card {
  gap: 0.85rem;
  padding: 0.9rem;
}

.dd-base-radius-shape,
.dd-base-border-sample,
.dd-base-shadow-sample {
  inline-size: 100%;
  aspect-ratio: 1 / 1;
  background: linear-gradient(135deg, rgba(47 155 143 / 0.18), rgba(148 163 184 / 0.15));
}

.dd-base-border-sample {
  background: v('color.bg.surface', '#ffffff');
  border-style: solid;
  border-color: #2f9b8f;
}

.dd-base-shadow-sample {
  background: v('color.bg.surface', '#ffffff');
}

.dd-base-space-sample {
  block-size: 2.25rem;
  display: flex;
  align-items: center;
  background: v('color.bg.surface-hover', 'rgba(148 163 184 / 0.12)');
  border-radius: 12px;
  padding-inline: 0.5rem;
}

.dd-base-space-bar {
  block-size: 0.75rem;
  border-radius: 999px;
  background: linear-gradient(90deg, #2f9b8f, #6ee7b7);
  max-inline-size: 100%;
}

.dd-base-motion-sample {
  block-size: 3rem;
  border-radius: 14px;
  background: v('color.bg.surface-hover', 'rgba(148 163 184 / 0.12)');
  display: flex;
  align-items: center;
  padding-inline: 0.45rem;
}

.dd-base-motion-sample span {
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 999px;
  background: #2f9b8f;
  transition: transform v('base.motion-duration', '180ms ease-in-out');
}

.dd-base-token-card:hover .dd-base-motion-sample span {
  transform: translateX(2rem);
}

.dd-base-z-stack {
  position: relative;
  block-size: 4rem;
}

.dd-base-z-layer {
  position: absolute;
  inset-block-start: 0;
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
}

.dd-base-z-layer-back {
  inset-inline-start: 0.75rem;
  inset-block-start: 0.65rem;
  background: v('color.bg.surface-hover', 'rgba(148 163 184 / 0.3)');
  color: v('color.text.muted', 'inherit');
}

.dd-base-z-layer-front {
  inset-inline-start: 1.55rem;
  background: v('color.primary-200', 'rgba(47 155 143 / 0.22)');
  color: v('color.text.default', 'inherit');
  box-shadow: 0 8px 20px rgba(0 0 0 / 0.15);
}

.dd-base-max-width-stage {
  display: flex;
  justify-content: center;
}

.dd-base-max-width-outer {
  inline-size: 100%;
  padding: 0.75rem;
  border-radius: 18px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(148 163 184 / 0.1),
      rgba(148 163 184 / 0.1) 20px,
      transparent 20px,
      transparent 40px
    );
}

.dd-base-max-width-inner {
  inline-size: min(100%, v('max-width'));
  block-size: 4rem;
  margin-inline: auto;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(47 155 143 / 0.2), rgba(110 231 183 / 0.45));
  box-shadow: inset 0 0 0 1px rgba(148 163 184 / 0.2);
}

@media (max-width: 960px) {
  .dd-base-color-grid,
  .dd-base-two-col {
    grid-template-columns: 1fr;
  }

  .dd-base-palette {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .dd-base-semantic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
