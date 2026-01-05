/**
 * Application Modules Configuration
 */

export const MODULES = {
  FAD: 'FAD',
  TPS: 'TPS',
}

export const getAllModules = () => Object.values(MODULES)

export const isValidModule = (moduleName) => {
  return getAllModules().includes(moduleName)
}
