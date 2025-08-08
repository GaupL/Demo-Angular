export class Register{
    id:string = "";
    name:string = "";
    nickName:string = "";
    email:string = "";
    role:string = "";
    address :string ="";
    newPassword:string = ""; // ใช้สำหรับเปลี่ยนรหัสผ่าน
    password:string = "";
    age:number = 0;
}
export interface jwtPayload{
    UserId:string;
    User:string;
    Name:string;
    
}