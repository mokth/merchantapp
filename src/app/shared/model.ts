import { Time } from "@angular/common";

export class PassData{
    public messageType:string;
    public payload:any;
    constructor(msgType:string,data:any){
        this.messageType= msgType;
        this.payload= data;
    }
}
// export class Bizhour {
//     public date: Date;
//     public strdate: string;
//     public status: string;
//     public note: string;
//     public fromTime: Date;
//     public toTime: Date;

//     constructor(theDate: Date, thestrdate: string, theStatus: string, theNote: string, from: Date, to: Date) {
//         this.date = theDate;
//         this.strdate = thestrdate;
//         this.status = theStatus;
//         this.note = theNote;
//         this.fromTime = from;
//         this.toTime = to;
//     }
// }

export class AdUser {
    public id: Number;
    public name:string;
    public pWord:string;
    public active:boolean;
    public role:string;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
}

export class RefItems{
    public id:Number;
    public code:string;
    public description:string;
    public refType:string;
    public active:string;
}

export class Merchant{
        public id:Number;
        public country: string;
        public state: string;
        public city: string;
        public area: string;
        public location: string;
        public companyCode: string;
        public branchCode: string;
        public companyName: string;
        public displayName: string;
        public status: string;
        public companyType: string;
        public regNo: string;
        public gstNo: string;
        public merchantType: string;
        public deliveryType: string;
        public merchantCategory: string;
        public address1: string;
        public address2: string;
        public addrCity: string;
        public addrState:string;
        public postcode: string;
        public contactPIC: string;
        public email: string;
        public officePhone: string;
        public handphone: string;
        public website: string;
        public facebook: string;
        public latitude: string;
        public longitude: string;
        public aboutUs: string;
        public termAndCond: string;
        public deliveryFee: number;
        public remarks: string;
        public salesAgent: string;
        public subscriptionType: string;
        public itemProfit: number;
        public halalCert: string;
        public taxGroup: string;
        public taxPercent: number;
        public updateDate: Date;
        public updateBy: string;
        public createDate: Date;
        public createBy: string;
}

export class RegisterProfile {
    public id:Number;
    public registerNo:string;
    public registerDate:Date;
    public companyName: string;
    public displayName: string;
    public regNo: string;
    public address1: string;
    public address2: string;
    public addrCity: string;
    public addrState:string;
    public postcode: string;
    public contactPIC: string;
    public email: string;
    public officePhone: string;
    public handphone: string;
    public website: string;
    public facebook: string;
    public updateDate: Date;
    public updateBy: string; 
    public aboutUs: string;
}

export class MechantItem {
    public id:Number;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
    public itemCode: string;
    public merchantItemCode: string;
    public itemStatus: string;
    public itemName: string;
    public itemDetail: string;
    public itemDetailCN: string;
    public itemDetailBM: string;
    public itemType: string;
    public itemTag: string;
    public itemCategory: string;
    public subCategory1: string;
    public subCategory2: string;
    public subCategory3: string;
    public subCategory4: string;
    public displayImage:string;
    public setEffective: boolean;
    public effectiveFrom: Date;
    public effectiveTo: Date;
    public prepareTime: string;
    public priceType: string;
    public taxName: string;
    public taxValue: number;
    public menuCategory: string;
    public itemProfit: number;
    public updateDate: Date;
    public updateBy: string;
    public createDate: Date;
    public createBy: string;
    public costPrice:number;
    public costWithGST:number;
    public costTaxAmount:number;
    public sellingPrice:number;
    public priceWithGST:number;
    public taxAmount:number;
    public options:ItemOption[];
}

export class ItemOption {
    public id:number;
    public itemCode:string;
    public optionCode:string;
    public merchantOptionCode:string;
    public optionType:string;
    public optionName:string;
    public optionNameCN:string;
    public optionNameBM:string;
    public imageName:string;
    public costPrice:number;
    public costWithGST:number;
    public costTaxAmount:number;
    public sellingPrice:number;
    public priceWithGST:number;
    public taxAmount:number;
    public active:boolean;
    public updateDate:Date;
    public updateBy:string;
    public createDate:Date;
    public createBy:string;
}

export class MerchantItemImage {
    public id:number;
    public itemCode:string;
    public imageName:string;   
    public defaultImage:boolean; 
}

export class ItemImages{
    public imageUrl:string;
    public imagename:string;
    public uploadedOn:Date;
    public default:boolean;
}

export class UserInfo
{
    public name:string;
    public fullname;
    public access:string;;
    public country:string;
    public state:string;
    public city:string;
    public area:string;
    public location:string;
    public companyCode:string;
    public branchCode:string;
    public role:string;
}

export class BizHour {
    public id: Number;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
    public workDate: Date;
    public dayType: string;
    public fromHour: Date;
    public toHour: Date;
    public repeatType: string;
    public dayName: string;
    public note: string;
    public updateDate: Date;
    public updateBy: string;
    public createDate: Date;
    public createBy: string;
}

export class ItemImageInfo
{
    public itemCode:string;
    public itemName:string;
    public optionCode:string;
    public optionType:string;
    public optionName:string;
    public imageName:string;
    public priceType:string;
    public costPrice:number;
    public costWithGST:number;
    public costTaxAmount:number;
    public sellingPrice:number;
    public priceWithGST:number;
    public taxAmount:number;
     
}

export class OrderInfo                                      
{                                                        
    public   iD :number;                        
    public   country :string;                
    public   state :string;                  
    public   city :string;                   
    public   area :string;                   
    public   location :string;               
    public   orderNo :string;                
    public   orderStatus :string;            
    public   orderDate :Date;           
    public   memberID :string;               
    public   totalAmount :Number;         
    public   promotionCode :string;          
    public   promotionValue :Number;     
    public   voucherCode :string;            
    public   redemptionCode :string;         
    public   voucherValue :Number;         
    public   netTotal :Number;            
    public   taxAmount :Number;          
    public   totalWithGST :Number;         
    public   deliveryCharge :Number;     
    public   deliverySurcharge :Number; 
    public   conciergeCharges :Number;   
    public   totalCost :Number;            
    public   paymentMethod :string;          
    public   deliveryType :string;           
    public   orderType :string;              
    public   deliveryDate :Date;        
    public   fromHour :string;            
    public   toHour :string;                       
    public   replaceOrderNo :string;         
    public   declinedReason :number;           
    public   isPaid :boolean;                 
    public   acountStatus :string;          
    public   runnerName :string;             
    public   updateDate :Date;          
    public   updateBy :string;               
    public   createDate :Date;          
    public   createBy :string;               
}     

export class vOrderItem {
    public id: string; //order dtl id
    public orderDate: string;
    public orderNo: string;
    public paymentMethod: string;
    public fromHour: string;
    public toHour: string;
    public deliveryDate: string;
    public orderLine: string;
    public lineStatus: string;
    public itemCode: string;
    public costWithGST: string;
    public priceWithGST: string;
    public quantity: string;
    public totalAmount: string;
    public totalAddonAmount: string;
    public netTotalAmount: string;
    public totalCost: string;
    public totalAddonCost: string;
    public netTotalCost: string;
    public ItemName: string;
    public itemNameCN: string;
    public itemID: string;
    public displayImage: string;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
    public companyName: string;
    public merchantID: string;

}

export class vOrderAddOn {
    public id: string;
    public orderDate: string;
    public orderNo: string;
    public paymentMethod: string;
    public fromHour: string;
    public toHour: string;
    public deliveryDate: string;
    public orderLine: string;
    public lineStatus: string;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
    public companyName: string;
    public merchantID: string;
    public optionCode: string;
    public optionStatus: string;
    public costWithGST: string;
    public priceWithGST: string;
    public quantity: string;
    public totalAddonAmount: string;
    public totalAddonCost: string;
    public optionName: string;
    public optionNameCN: string;
    public imageName: string;
}

export class OrderDetail
{
    public orderno:string;
    public addons:vOrderAddOn[];
    public items:vOrderItem[];
}

export class OrderLineStatus
{
    public id :number;
    public orderNo:string;
    public orderLine:number;
    public lineStatus:string;
    public reason:string;
}