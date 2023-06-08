import { ICustomer, ICustomerAddress } from '../customer/customer.types'
import { anonymiseValue } from '../utils/anonymise'

export function anonymiseCustomerAddress(
    customerAddress: ICustomerAddress
): ICustomerAddress {
    return {
        line1: anonymiseValue(customerAddress.line1),
        line2: anonymiseValue(customerAddress.line2),
        state: customerAddress.state,
        city: customerAddress.city,
        country: customerAddress.country,
        postcode: anonymiseValue(customerAddress.postcode),
    }
}
export function anonymiseCustomer(customer: ICustomer): ICustomer {
    const [email, emailDomain] = customer.email.split('@')

    return {
        _id: customer._id,
        firstName: anonymiseValue(customer.firstName),
        lastName: anonymiseValue(customer.lastName),
        email: [anonymiseValue(email), emailDomain].join('@'),
        address: anonymiseCustomerAddress(customer.address),
        createdAt: customer.createdAt,
    }
}
