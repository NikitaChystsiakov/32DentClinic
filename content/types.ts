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
  steps: TreatmentTimelineStep[]
  gapLabels?: TreatmentTimelineGapLabel[]
}
