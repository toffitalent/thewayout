export enum JusticeStatus {
  noOffense = 'noOffense',
  freeWorld = 'freeWorld',
  probation = 'probation',
  parole = 'parole',
  halfwayHouse = 'halfwayHouse',
  extendedSupervision = 'extendedSupervision',
  currentlyIncarcerated = 'currentlyIncarcerated',
}

export const justiceText = {
  [JusticeStatus.noOffense]: 'No Offense',
  [JusticeStatus.freeWorld]: 'Free World',
  [JusticeStatus.halfwayHouse]: 'Halfway House',
  [JusticeStatus.extendedSupervision]: 'Extended Supervision',
  [JusticeStatus.probation]: 'On probation',
  [JusticeStatus.parole]: 'On parole',
  [JusticeStatus.currentlyIncarcerated]: 'Currently Incarcerated',
};
