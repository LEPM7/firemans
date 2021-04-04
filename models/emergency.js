export class Emergency {  
    constructor(
        state,
        contactPhone,
        latitude,
        longitude,
        fireStation,
        ambulance,
        name,
    ){
        this.state = state;
        this.contactPhone = contactPhone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fireStation = fireStation;
        this.ambulance = ambulance;
        this.name = name;
        this.date = new Date();
    }
}