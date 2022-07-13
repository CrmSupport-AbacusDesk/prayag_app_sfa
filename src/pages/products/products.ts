import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, ModalController } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { SQLite } from '@ionic-native/sqlite';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { AddOrderPage } from '../add-order/add-order';
import { Storage } from '@ionic/storage';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';


@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage 
{
    product_list:any=[];
    category_list:any=[];
    filter :any = {};
    flag:any='';
    loading:Loading;
    cat_images:any=[];
    category_count:any='';
    no_rec:any=false;
    name:any='';
    skelton:any={};
    order:any = false;
    filter_active:any = false;
    length:any = 20;
    filter_category_active:any = false;
    filter_price_active:any = false;
    image_url:any = '';
    
    cart_array:any=[];
    data:any={};
    userId:any = '';
    user_data:any={};
    userType:any
    products: any=[];

    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public service:DbserviceProvider,
        public service1: MyserviceProvider,
        public loadingCtrl:LoadingController,
        private app:App,
        public offlineService: OfflineDbProvider,
        public modalCtrl: ModalController,
        public constant:ConstantProvider,
        private sqlite: SQLite,
        public storage: Storage) 
        {
            this.getProductList();
            this.image_url = this.constant.upload_url1 + 'Products/'
            
            // this.skelton = new Array(10);
            console.log(this.image_url);
            // this.storage.get('userId').then((userId) => 
            // {
            //     if(typeof(userId) !== 'undefined' && userId)
            //     {
            //         this.userId = userId;
            //     }
            // });
            // console.log(this.userId);
            
            
            if(this.constant.UserLoggedInData.loggedInUserType == 'Employee')
            {
                this.userType='Employee'
            }
            else
            {
                this.userType='drLogin'
            }
            console.log(this.userType);
            
            setTimeout(() => 
            {
                console.log(this.userType);
                
                if(this.userType!='Employee')
                {
                    console.log(this.constant.UserLoggedInData);
                    
                    this.user_data = this.constant.UserLoggedInData.all_data;
                    if(this.user_data)
                    this.userId = this.user_data.id
                }
                else
                {
                    this.storage.get('userId').then((resp)=>
                    {
                        this.userId = resp
                    });
                }
                setTimeout(() => 
                {
                    console.log(this.userId);

                    this.getCatalogueData();
                    this.getFilterData();
                    
                }, 200);
            }, 200);

            console.log(this.userId);
    }
        
        ionViewDidLoad() 
        {
            console.log('ionViewDidLoad ProductsPage');
            // this.filter.name  = this.navParams.get('name');
            this.filter.data = this.navParams.get("data");
            this.filter.type = this.navParams.get("type");
            if(this.navParams.get("order") != undefined && this.navParams.get("order")== true)
            {
                this.order = this.navParams.get("order");
                this.data = this.navParams.get("order_data");
                console.log(this.navParams.get("order_data"));
                
                if(this.navParams.get("cart_array"))
                {
                    this.cart_array = this.navParams.get("cart_array");
                }
                else
                {
                    this.cart_array = [] ;
                }
            }
            console.log(this.order);           
        }
        
        ionViewWillEnter()
        {
            // this.getProductCategoryList();
            // this.getProductCategoryListWithLiveServer()
            // this.getProductList();
            // this.getFilterData();
            // this.presentLoading();
        }

        doRefresh(refresher)
        {
            console.log("hello");

            console.log('Begin async operation', refresher);
            // this.getProductCategoryList();
            this.getProductList();
            this.getFilterData();
            refresher.complete();
            console.log("enter");
            
        }
        
        goOnProductDetailPage(id)
        {
            if(this.order == true)
            {
                console.log("hello");

                this.navCtrl.push(ProductDetailPage,{'id':id,"order":true,"order_data":this.data,"cart_array":this.cart_array});
            }
            else
            {
                this.navCtrl.push(ProductDetailPage,{'id':id})
            }
            
        }
        
        getFilterData()
        {
            this.filter = {};
            this.filter['category'] = [];
            
            this.service1.addData({},'product/filterData').then((resp:any)=>{
                console.log(resp);
                this.category_list = resp['category_list'];
                
                this.category_list.map((x:any)=>{
                    x.checked = false;
                });
            })
        }
        
        filter_by(action:any,id:any,type)
        {

          this.service1.dismiss();

            if(type == 'category')
            {
                if(action == true)
                {
                    this.filter['category'].push(id);
                }
                else
                {
                    var index = this.filter['category'].indexOf(id); 
                    this.filter['category'].splice(index,1);
                }
            }

            if(type == 'price')
            {
                this.filter.price = action;
            }
            
            console.log(this.filter);
        }
        
        getProductList()
        {
            this.filter.limit = 0;
            if(!this.filter.search_key)   
            console.log("hello2");

            //    this.service1.show_loading();
               
            console.log(this.data);
            
            var dr_id
            if(this.data && this.data.type_name)
              dr_id = this.data.type_name.id
            else
              dr_id = this.userId

            console.log(dr_id);
            this.service1.addData({'filter' : this.filter,'category':this.filter.search_key,'order':this.order,'dr_id':dr_id,'userId':this.userId,'userType':this.userType},'Lead/itemList').then((response)=>
            {
                console.log(response);
                this.products= response['data'];
                                // this.product_list = response.products;
                console.log("hello1");
                
                // this.service1.dismiss();
                console.log("hello");

                if(this.order == true)
                {
                    for (let i = 0; i < this.product_list.length; i++) 
                    {
                        this.product_list[i].qty = 0; 
                    }
                }
            },
            er=>
            {
                console.log("hello3");

                this.service1.dismiss();
            });
        }

    
        
        getCatalogueData()
        {
            console.log("hello4");

          this.service1.show_loading();
          console.log("hello");

          this.service.get_request('Product/product_list').subscribe((response)=>
          {
            console.log(response);
      
      this.products= response.product_list;
      
      console.log(this.products);
      
            this.category_list = response.categories;
            console.log("hello5");
            this.service1.dismiss();
            console.log("hello6");

          },er=>
          {
            console.log("hello");

            this.service1.dismiss();
          });  
        }


        loadData(infiniteScroll)
        {
            console.log("hello");

            console.log('loading');
            console.log("hello");

            var dr_id
            if(this.data && this.data.type_name)
              dr_id = this.data.type_name.id
            else
              dr_id = this.userId
            
            this.filter.limit=this.product_list.length;
            this.service.post_rqst({'filter' : this.filter,'order':this.order,'dr_id':dr_id,'userId':this.userId,'userType':this.userType},'Product/product_list').subscribe( response =>
                {
                    console.log(response);
                    if( response.products == '')
                    {
                        this.flag=1;
                        console.log("hello");

                    }
                    else
                    {
                        setTimeout(()=>
                        {                  console.log("hello");

                            this.product_list=this.product_list.concat(response.products);
                            console.log(this.product_list.length +' '+ response.products.length)
                            if(this.order == true)
                            {
                                for (let i = 0; i < this.product_list.length; i++) 
                                {
                                    this.product_list[i].qty = 0; 
                                }
                            }
                            console.log("hello");

                            infiniteScroll.complete();
                        },1000);
                    }
                });
            }
            
            MobileNumber1(event: any) 
            {
                console.log('Decimal Restrit');
                
                const charCode = (event.which) ? event.which : event.keyCode;
                console.log(charCode);
                
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            }
            
            quantity(indx:any,value:any)
            {
                if(value == 'add')
                {
                    var tmp_qty = 0;
                    tmp_qty = parseInt(this.product_list[indx]['qty'])+1;
                    this.product_list[indx]['qty']=tmp_qty;
                }
                else
                {
                    if(this.product_list[indx]['qty'] > 0)
                    {
                        this.product_list[indx]['qty']=parseInt(this.product_list[indx]['qty'])-1;
                    }
                    else
                    {
                        this.product_list[indx]['qty']=0;
                    }
                }
            }
            
            
            addToCart(value:any = {},i)
            {
                
                console.log(value);
                
                
                value.discount_amount = 0;
                value.subTotal = 0;
                value.discountedAmount = 0;
                
                value.subTotal = (value.price)*(value.qty);
                
                if(value.discount)
                {
                    value.discount_amount = (value.price * value.discount)/100;
                }
                
                value.discountedAmount = parseFloat(value.price) - parseFloat(value.discount_amount)
                
                value.subtotal_discount = value.discount_amount * value.qty;
                
                value.subtotal_discounted = value.discountedAmount * value.qty;
                value.subtotal_discounted  = parseFloat(value.subtotal_discounted.toFixed(2))

                value.gst_amount = (value.subtotal_discounted * (parseFloat(value.gst_percent)/100)); 
    
                value.gst_amount = parseFloat(value.gst_amount.toFixed(2));
                
                value.amount = parseFloat(value.subtotal_discounted) + parseFloat(value.gst_amount);
                
                value.amount = parseFloat(value.amount.toFixed(2));
                console.log(value);
                
                if(this.cart_array.length == 0)
                {
                    this.cart_array.push(value);
                }
                else
                {
                    var flag = true;
                    this.cart_array.forEach(element => {
                        
                        if(value.category == element.category &&  value.cat_no == element.cat_no)
                        {
                            element.subTotal=parseFloat(value.subTotal);
                            
                            element.subtotal_discount=parseFloat(value.subtotal_discount);

                            element.subtotal_discounted=  parseFloat(value.subtotal_discounted);

                            element.gst_amount= parseFloat(value.gst_amount);

                            element.amount=  parseFloat(value.gross_total);

                            element.qty= parseFloat(value.qty);
                            
                            flag = false;
                        }
                    });
                    
                    if(flag)
                    {
                        this.cart_array.push(value);
                    }

                } 
                
                console.log(this.cart_array);              
                
            }
            
            toGoOrderPage()
            {
                // console.log(this.cart_array);
                // console.log(this.data);
                // console.log(this.userType);
                // this.data.from_product = true;
                if(this.userType == 'Employee')
                {
                    // this.navCtrl.push(AddOrderPage,{"cart_array":this.cart_array,'from_product':true,'data':this.data});
                    this.navCtrl.pop();
                }
                else
                {
                    this.navCtrl.push(DealerAddorderPage,{"cart_array":this.cart_array,'from_product':true,'order_data':this.data});
                }
            }
            
            
            ionViewDidLeave()
            {
                let nav = this.app.getActiveNav();
                if(nav && nav.getActive())
                {
                    let activeView = nav.getActive().name;
                    let previuosView = '';
                    if(nav.getPrevious() && nav.getPrevious().name)
                    {
                        previuosView = nav.getPrevious().name;
                    }
                    console.log(previuosView);
                    console.log(activeView);
                    console.log('its leaving');
                    if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
                    {
                        console.log(previuosView);
                        this.navCtrl.popToRoot();
                    }
                }
            }
            
            // presentLoading()
            // {
            //     this.loading = this.loadingCtrl.create({
            //           content: "Please wait...",
            //           dismissOnPageChange: true
            //     });
            //     this.loading.present();
            // }
            
            // goToDetail()
            // {
            //     this.navCtrl.push(ProductDetailPage);
            //         // this.navCtrl.push(ProductSubdetailPage,{'id':50});
            // }
            
            
            // getProductCategoryList() 
            // {
            //     console.log("direct category");
            
            //     this.filter.limit = 0;
            //     this.no_rec=false
            //     const searchData = JSON.parse(JSON.stringify(this.filter));
            
            //     if(searchData.category_name) {
            //         searchData.category_name = '%' + searchData.category_name + '%';
            //     }
            
            //     this.offlineService.onGetCategoryListHandler(searchData).subscribe((categoryData) => {
            
            //        console.log("direct category result");
            
            //         console.log(categoryData);
            
            //         this.product_list = JSON.parse(JSON.stringify(categoryData));
            
            //         for (let index = 0; index < this.product_list.length; index++) 
            //         {
            
            //             let imageName = '';
            //             if(this.product_list[index].image && this.product_list[index].image.length > 0) {
            
            //                 imageName = this.product_list[index].image[0].image;
            //             }
            
            //             this.offlineService.onReturnImagePathHandler('categoryImage', imageName, this.product_list[index].id).subscribe((imageResultData) => {
            
            //                 console.log(imageResultData);
            
            //                 const categoryIndex = this.product_list.findIndex(row => row.id == imageResultData.recordId);
            
            //                 console.log(this.product_list);
            //                 console.log('categoryIndex ' + categoryIndex);
            
            //                 this.product_list[categoryIndex].imageCompletePath = imageResultData['imagePath'];
            //             });
            //         }
            
            //         if(this.product_list.length == 0) {
            
            //             this.no_rec = true;
            
            //         } else {
            
            //             this.no_rec = false;
            //         }
            //     });
            // }
            
            // getProductCategoryListWithLiveServer()
            // {
            //     this.filter.limit = 0;
            //     this.service.post_rqst({'filter' : this.filter},'Product/categoryList').subscribe((r)=>
            //     {
            //         this.loading.dismiss();
            //         this.product_list=r['categories'];
            //         if(this.product_list.length == 0)
            //         {
            //             this.no_rec = true;
            //         }
            //         else
            //         {
            //             this.no_rec = false;
            //         }
            //         for (let index = 0; index < this.product_list.length; index++) 
            //         {
            //             // this.getImages(this.product_list[index]['id'],index)
            //         }
            
            //         // if(this.product_list.length == 1)
            //         // {
            //         //   console.log('list length is one');
            //         //   console.log(this.product_list[0].id);
            //         //   this.goOnProductDetailPage(this.product_list[0].id)
            //         // }
            //     },(error: any) => {
            //         // this.loading.dismiss();
            //     })
            // }
            
            
            // getImages(category_id,index)
            // {
            //     this.service.post_rqst({'category_id' : category_id},'app_master/getSubCatImages').subscribe((res)=>{
            //         this.product_list[index]['image']=res['image'];
            //     })
            // }
            
            // goToProductsWithSearch(globalSearchData)
            // {
            //     this.navCtrl.push(ProductDetailPage, {'id':'', categoryName: this.filter.name, globalSearchData: globalSearchData, src: 'category'})
            // }
            
            
}
        