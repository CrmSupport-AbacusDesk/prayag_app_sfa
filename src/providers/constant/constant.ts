import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ConstantProvider {
    public UserLoggedInData: any={}
    public deviceId:any
    public tabSelectedOrder:any
    constructor(public http: Http,public storage:Storage)
    {
        console.log('Hello ConstantProvider Provider');
        this.storage.get('loginData').then((res)=>
        {
            if(res.loggedInUserType!='"Employee"')
            {
                this.UserLoggedInData=res
            }
            
            console.log(this.UserLoggedInData);
        })
        storage.get('loggedInUserType')
        .then((loggedInUserType) => {
            console.log(loggedInUserType);
            var data = {
                'loggedInUserType':loggedInUserType
            }
            Object.assign(this.UserLoggedInData, data)
            console.log(this.UserLoggedInData);
        });
        storage.get('token_value')
        .then((val) => {
            var data
            console.log(val);
            if(val == '' || val == null || val == undefined)
            {
                data = {
                    'userLoggedInChk':false
                }
            }
            else
            {
                data = {
                    'userLoggedInChk':true
                }
            }
            console.log(data);
            
            Object.assign(this.UserLoggedInData, data)
            console.log(this.UserLoggedInData);
        });
    }
    public connectionChk =''  
    public networkType =''

    public rootUrl2: string ='https://app.abacusdesk.co.in/prayagsfa/api/index.php/'
    public rootUrl: string =  'https://app.abacusdesk.co.in/prayagsfa/api/index.php/app/'
    public rootUrl1: string =  'https://app.abacusdesk.co.in/prayagsfa/'
    public rootUrl3: string =  'https://app.abacusdesk.co.in/prayagsfa/api/index.php/'

    public rootUrlSfa: string =  'https://app.abacusdesk.co.in/prayagsfa/api/index.php/app/'
    public server_url: string = this.rootUrl1 + 'index.php/app/';
    public upload_url: string = this.rootUrl1 + 'uploads/';
    public upload_url1: string = 'https://app.abacusdesk.co.in/prayagsfa/api/uploads/';
    public upload_url2: string = 'https://app.abacusdesk.co.in/prayagsfa/uploads/order-invoice/';
    public img_url: string =  'https://app.abacusdesk.co.in/prayagsfa/api/'

    // public backButton = 0;



    // public rootUrl2: string ='https://fsa.kei-ind.in/api/index.php/'
    // public rootUrl: string =  'https://fsa.kei-ind.in/api/index.php/app/'
    // public rootUrl1: string =  'https://fsa.kei-ind.in/api/'
    // public rootUrl3: string =  'https://fsa.kei-ind.in/api/index.php/'

    // public rootUrlSfa: string =  'https://fsa.kei-ind.in/api/index.php/app/'
    // public server_url: string = this.rootUrl1 + 'index.php/app/';
    // public upload_url: string = this.rootUrl1 + 'uploads/';
    // public upload_url1: string = 'https://fsa.kei-ind.in/api/uploads/';
    // public upload_url2: string = 'https://fsa.kei-ind.in/uploads/order-invoice/';
    // public img_url: string =  'https://fsa.kei-ind.in/api/'
    public backButton = 0;

    setData()
    {
        console.log('called')
        this.storage.get('loginData').then((res)=>
        {
            if(res.loggedInUserType!='"Employee"')
            {
                this.UserLoggedInData=res
            }
            
            console.log(this.UserLoggedInData);
        })
        this.storage.get('loggedInUserType')
        .then((loggedInUserType) => {
            console.log(loggedInUserType);
            var data = {
                'loggedInUserType':loggedInUserType
            }
            Object.assign(this.UserLoggedInData, data)
            console.log(this.UserLoggedInData);
        });
        this.storage.get('token_value')
        .then((val) => {
            var data
            console.log(val);
            if(val == '' || val == null || val == undefined)
            {
                data = {
                    'userLoggedInChk':false
                }
            }
            else
            {
                data = {
                    'userLoggedInChk':true
                }
            }
            Object.assign(this.UserLoggedInData, data)
            console.log(this.UserLoggedInData);
        });
    }
}
