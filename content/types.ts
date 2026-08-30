export interface TreatmentTimelineStep {
  step: number
  duration: string
  title: string
  description: string
  icon: string
  isMilestone?: boolean
  photo?: string
}

export interface TreatmentTimelineGapLabel {
  afterStep: number
  label: string
  icon?: string
}

export interface TreatmentTimeline {
  eyebrow?: string
  title?: string
  subtitle?: string
  steps: TreatmentTimelineStep[]
  gapLabels?: TreatmentTimelineGapLabel[]
}
