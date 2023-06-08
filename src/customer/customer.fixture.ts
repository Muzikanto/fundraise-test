import { ICustomer, ICustomerAddress } from './customer.types'
import { faker } from '@faker-js/faker'
import { randomId } from '../utils/nanoid'

export function getCustomerAddressFixture(): ICustomerAddress {
    return {
        line1: faker.location.streetAddress(),
        line2: faker.location.secondaryAddress(),
        postcode: faker.location.zipCode(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.countryCode(),
    }
}

export function getCustomerFixture(): ICustomer {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = faker.internet.email({ firstName, lastName })
    const createdAt = faker.date
        .between({ from: new Date('2020-01-01'), to: new Date() })
        .toISOString()

    return {
        _id: randomId(),
        firstName,
        lastName,
        email,
        address: getCustomerAddressFixture(),
        createdAt,
    }
}

export function getCustomersFixtures(customersCount: number): ICustomer[] {
    const customersFixtures: ICustomer[] = Array.from(
        { length: customersCount },
        () => getCustomerFixture()
    )

    return customersFixtures
}
