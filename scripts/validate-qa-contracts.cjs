const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const featureId = process.argv[2] || 'ofrecimientos-invernada'
const configPath = path.join(root, 'config', `${featureId}.yaml`)
const planPath = path.join(root, 'specs', `${featureId}.md`)

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`)
  return fs.readFileSync(file, 'utf8')
}

const config = read(configPath)
const plan = read(planPath)
const errors = []

for (const section of ['discovery_contract:', 'automation_contract:', 'required_outputs:', 'required_case_types:']) {
  if (!config.includes(section)) errors.push(`Config missing ${section}`)
}

for (const contractRule of ['require_case_for_each_include: true', 'require_test_for_each_automatable_case: true', 'forbid_unobserved_selectors: true']) {
  if (!config.includes(contractRule)) errors.push(`Config missing ${contractRule}`)
}

const includeIds = [...config.matchAll(/id:\s+([A-Z][A-Z0-9-]+)/g)].map((match) => match[1])
for (const id of includeIds) {
  if (!plan.includes(id)) errors.push(`Plan has no coverage entry for ${id}`)
}

const featureDir = path.join(root, 'cypress', 'e2e', featureId)
if (fs.existsSync(featureDir)) {
  const specFiles = fs.readdirSync(featureDir).filter((file) => file.endsWith('.cy.js'))
  if (!specFiles.length) errors.push(`No Cypress spec found for ${featureId}`)
  for (const file of specFiles) {
    const source = read(path.join(featureDir, file))
    if (/\bcy\.(get|contains|find)\s*\(/.test(source)) {
      errors.push(`${file}: direct selectors must be moved to a Page Object`)
    }
  }
}

if (errors.length) {
  console.error('QA contract validation failed:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exitCode = 1
} else {
  console.log(`QA contract validation passed for ${featureId}`)
}
