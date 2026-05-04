<script setup lang="ts">
import { inject } from 'vue'
import { STUDIO_PREVIEW_CONTEXT_KEY } from '../interaction'

const previewContext = inject(STUDIO_PREVIEW_CONTEXT_KEY, null)

const avatarSizes = [
  { label: 'Small', text: 'SM', attrs: { small: true }, fieldPath: 'avatar.sm.size', fontFieldPath: 'avatar.sm.font-size' },
  { label: 'Base', text: 'AV', attrs: {}, fieldPath: 'avatar.size', fontFieldPath: 'avatar.font-size' },
  { label: 'Large', text: 'LG', attrs: { large: true }, fieldPath: 'avatar.lg.size', fontFieldPath: 'avatar.lg.font-size' },
  { label: 'XL', text: 'XL', attrs: { xlarge: true }, fieldPath: 'avatar.lg.size', fontFieldPath: 'avatar.lg.font-size' }
]

const statusStates = [
  { label: 'Online', text: 'ON', attrs: { online: true } },
  { label: 'Busy', text: 'BZ', attrs: { busy: true } },
  { label: 'Away', text: 'AW', attrs: { away: true } },
  { label: 'Offline', text: 'OF', attrs: { offline: true } }
]

function focusField(path: string) {
  previewContext?.focusField(path)
}

function resolveFieldValue(path: string, fallback: string) {
  return previewContext?.resolveFieldValue(path) || fallback
}
</script>

<template>
  <section class="dd-studio-preview">
    <header class="dd-studio-preview-header">
      <h2>Avatar</h2>
      <p>Size, radius, overlap and fallback-initials typography.</p>
      <div class="dd-avatar-preview-note">
        <strong>Color behavior</strong>
        <span>
          Fallback avatars use the theme tokens `avatar.background-color` and `avatar.color` by default. Edit those two tokens to control the default initials background and text color your theme ships with.
        </span>
        <span>
          Use the optional `random` variant only when you want the component to ignore those theme tokens and generate its own pastel color pair.
        </span>
      </div>
    </header>

    <div class="dd-studio-preview-block">
      <h3>Sizes</h3>
      <div class="dd-avatar-grid">
        <button
          v-for="size in avatarSizes"
          :key="size.label"
          type="button"
          class="dd-avatar-card"
          @click="focusField(size.fieldPath)"
        >
          <DdAvatar v-bind="size.attrs" :alt="size.text" />
          <strong>{{ size.label }}</strong>
          <span>{{ resolveFieldValue(size.fieldPath, 'var(--dd-avatar-size)') }}</span>
          <small>{{ resolveFieldValue(size.fontFieldPath, 'var(--dd-avatar-font-size)') }}</small>
        </button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Shape and status</h3>
      <div class="dd-avatar-grid dd-avatar-grid-tight">
        <button
          type="button"
          class="dd-avatar-card"
          @click="focusField('avatar.border-radius')"
        >
          <DdAvatar alt="RD" />
          <strong>Rounded</strong>
          <span>{{ resolveFieldValue('avatar.border-radius', 'var(--dd-avatar-border-radius)') }}</span>
        </button>

        <button
          type="button"
          class="dd-avatar-card"
          @click="focusField('avatar.border-radius')"
        >
          <DdAvatar alt="SQ" square />
          <strong>Square variant</strong>
          <span>Uses component square data-attr</span>
        </button>

        <button
          v-for="status in statusStates"
          :key="status.label"
          type="button"
          class="dd-avatar-card"
          @click="focusField('avatar.size')"
        >
          <DdAvatar v-bind="status.attrs" :alt="status.text" />
          <strong>{{ status.label }}</strong>
          <span>Status indicator</span>
        </button>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Fallback colors</h3>
      <div class="dd-avatar-color-row">
        <button
          type="button"
          class="dd-avatar-color-card"
          @click="focusField('avatar.background-color')"
        >
          <span
            class="dd-avatar-color-sample"
            :style="{
              backgroundColor: resolveFieldValue('avatar.background-color', 'var(--dd-avatar-background-color)'),
              color: resolveFieldValue('avatar.color', 'var(--dd-avatar-color)'),
              borderRadius: resolveFieldValue('avatar.border-radius', 'var(--dd-avatar-border-radius)'),
              fontSize: resolveFieldValue('avatar.font-size', 'var(--dd-avatar-font-size)'),
              fontWeight: resolveFieldValue('avatar.font-weight', 'var(--dd-avatar-font-weight)')
            }"
          >
            AV
          </span>
          <strong>Fallback initials</strong>
          <span>{{ resolveFieldValue('avatar.background-color', 'var(--dd-avatar-background-color)') }}</span>
          <small>{{ resolveFieldValue('avatar.color', 'var(--dd-avatar-color)') }}</small>
        </button>

        <div class="dd-avatar-color-card dd-avatar-color-card-muted">
          <DdAvatar alt="RN" random />
          <strong>Optional random variant</strong>
          <span>Uses the generated palette only when `random` is set on the component.</span>
          <small>Not controlled by theme tokens</small>
        </div>
      </div>
    </div>

    <div class="dd-studio-preview-block">
      <h3>Group overlap</h3>
      <button
        type="button"
        class="dd-avatar-group-card"
        @click="focusField('avatar.overlap')"
      >
        <DdAvatarGroup>
          <DdAvatar alt="Ana Souza" />
          <DdAvatar alt="Bruno Lima" />
          <DdAvatar alt="Clara Nunes" />
          <DdAvatar alt="Diego Costa" />
        </DdAvatarGroup>
        <span>{{ resolveFieldValue('avatar.overlap', 'var(--dd-avatar-overlap)') }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.dd-avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
  gap: 1rem;
}

.dd-avatar-preview-note {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.8rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(14 116 144 / 0.16);
  background: linear-gradient(180deg, rgba(240 249 255 / 0.95), rgba(224 242 254 / 0.9));
  color: #0f172a;
}

.dd-avatar-preview-note strong {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.dd-avatar-preview-note span {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #334155;
}

.dd-avatar-grid-tight {
  grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
}

.dd-avatar-card,
.dd-avatar-color-card,
.dd-avatar-group-card {
  border: 1px solid rgba(15 23 42 / 0.08);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.dd-avatar-card:hover,
.dd-avatar-color-card:hover,
.dd-avatar-group-card:hover {
  border-color: rgba(47 155 143 / 0.4);
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15 23 42 / 0.08);
}

.dd-avatar-card {
  display: grid;
  justify-items: start;
  gap: 0.55rem;
  padding: 1rem;
}

.dd-avatar-card strong,
.dd-avatar-color-card strong {
  font-size: 0.92rem;
}

.dd-avatar-card span,
.dd-avatar-color-card span,
.dd-avatar-group-card span {
  color: #475569;
  font-size: 0.8rem;
}

.dd-avatar-card small,
.dd-avatar-color-card small {
  color: #64748b;
  font-size: 0.72rem;
}

.dd-avatar-color-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 15rem));
  gap: 1rem;
}

.dd-avatar-color-card {
  display: grid;
  justify-items: start;
  gap: 0.55rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(255 255 255 / 0.98), rgba(248 250 252 / 0.98));
}

.dd-avatar-color-card-muted {
  cursor: default;
  border-style: dashed;
}

.dd-avatar-color-card-muted:hover {
  border-color: rgba(15 23 42 / 0.08);
  transform: none;
  box-shadow: none;
}

.dd-avatar-color-sample {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 4.25rem;
  block-size: 4.25rem;
  border: 1px solid rgba(15 23 42 / 0.08);
  box-shadow: inset 0 1px 0 rgba(255 255 255 / 0.22);
}

.dd-avatar-group-card {
  display: grid;
  justify-items: start;
  gap: 0.85rem;
  padding: 1rem;
  width: 100%;
}
</style>
