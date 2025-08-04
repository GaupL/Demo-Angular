export const claimReq={
    admin:(x:any) => x.role == "admin",
    user:(x:any) => x.role == "user"
    // x.role มาจาก decode token ที่ได้จากการ login
}