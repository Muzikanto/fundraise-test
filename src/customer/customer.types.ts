export type ICustomerAddress = {
    line1: string // "34801 Kurt Spur"
    line2: string // "Suite 028"
    postcode: string // "45081"
    city: string // "Hailieberg"
    state: string // "NY"
    country: string // "US"
}
export type ICustomer = {
    _id: string // ObjectId("64155ece0ac406903b7eb4a1")
    firstName: string // "Cindy"
    lastName: string // "Doyle"
    email: string // "Cindy.Doyle@hotmail.com"
    address: ICustomerAddress
    createdAt: string // ISODate("2022-12-11T19:08:41.683Z")
}
