import { ICustomer, ICustomerAddress } from '../customer'

export type ICustomerAnonymisedAddress = ICustomerAddress
export type ICustomerAnonymised = Omit<ICustomer, 'address'> & {
    address: ICustomerAnonymisedAddress
}
