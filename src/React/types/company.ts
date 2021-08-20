export interface Company {
    companyId: number;
    name: string;
    abn: string;
    address: string;
    phone: string;
    email?: string;
    gst?: number;
    gstNumber?: string;
    bankName?: string;
    bankBsb?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
}