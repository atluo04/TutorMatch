export default function validate(name, value, validations) {
    const errors = []
    if (value) {
        if (validations.minLength) {
            if (value.length < validations.minLength) {
                errors.push(`${name} must be longer than ${validations.minLength} characters`)
            }
        }
        if (validations.maxLength) {
            if (value.length > validations.maxLength) {
                errors.push(`${name} must be less than ${validations.maxLength} characters`)
            }
        }
        if (validations.pattern) {
            if (!validations.pattern?.pattern.test(value)) {
                for (const error of validations.pattern.error) {
                    errors.push(error)
                }
            }
        }
        if (validations.samePassword) {
            if (value !== validations.samePassword) {
                errors.push(`Passwords don't match`)

            }
        }
        if (validations.minAge) {
            var currendDate = new Date()
            const birthdate = new Date(value)
            if ((currendDate - birthdate) / (1000 * 3600 * 24 * 365) < validations.minAge) {
                errors.push(`You must be at least ${validations.minAge} years old.`)
            }
        }
    }
    else if (validations.required) {
        errors.push(`${name} is required`)
    }

    return errors
}