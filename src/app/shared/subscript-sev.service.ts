import {Injectable, Inject} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { SwPush } from "@angular/service-worker";
import { UserInfo } from "./model";
import { AuthService } from "./auth.service";
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable()
export class SubscriptSevService {
  sub: PushSubscription;
  readonly VAPID_PUBLIC_KEY = "BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg";
 
 constructor(private http: HttpClient,
             private swPush: SwPush,             
             @Inject('API_URL') private apiUrl:string) {
   }
//fcm sender id : 893739970358
  addPushSubscriber(sub:any,token:any) {
    let headers = new HttpHeaders()
    .set('Content-Type',"application/json")
    .set('Authorization', token);
    return this.http.post(this.apiUrl+'push-notifications-api/subscriptions', sub,{ headers: headers });
  }

  subscribeToNotificationsNew(token:any) {
    
    console.log("Notification Subscription: ");
    if (!this.swPush.isEnabled){
        console.log("Notification Subscription faile. SW not enable. ");
        return;
    }
    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
        this.sub = sub;
        console.log("Notification Subscription: ", sub);
        console.log(sub);
        this.addPushSubscriber(sub,token).subscribe(
            () => console.log('Sent push subscription object to server.'),
            err =>  console.log('Could not send subscription object to server, reason: ', err)
        );

    })
    .catch(err => {
        console.error("Could not subscribe to notifications", err);
        console.log(err);}
  );

 }

 subscribeToNotifications(token:any){
    var serviceWorker = fromPromise(navigator.serviceWorker.ready);
    serviceWorker.subscribe(serviceWorkerRegistration=>{
        var getSubscription = fromPromise(serviceWorkerRegistration.pushManager.getSubscription());
        getSubscription.subscribe(subscription=>{
            console.log('isCheckPushReg...');
            console.log(subscription);
            if (!subscription) {
                console.log('Create new Subscription...');  
              this.subscribeToNotificationsNew(token);
              return ;
            }
            console.log('update Subscription...'); 
            //this.addPushSubscriber(subscription,token);
            this.addPushSubscriber(subscription,token).subscribe(
                () => console.log('Sent update push subscription object to server.'),
                err =>  console.log('Could not send update subscription object to server, reason: ', err)
            );
          },
          (error)=>{
            console.log('Error during getSubscription()', error);
          }
        );
    });

    // navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    //   // Do we already have a push message subscription?
    //   serviceWorkerRegistration.pushManager.getSubscription()
    //     .then(function(subscription) {
    //       // Enable any UI which subscribes / unsubscribes from
    //       // push messages.
    //      // var pushButton = document.querySelector('.js-push-button');
    //       //pushButton.disabled = false;
    //       console.log('isCheckPushReg...');
    //       console.log(subscription);
    //       if (!subscription) {
    //         this.subscribeToNotificationsNew(token);
    //         return ;
    //       }
  
    //       // Keep your server in sync with the latest subscriptionId
    //       //sendSubscriptionToServer(subscription);
    //       this.addPushSubscriber(subscription,token);
    //      // showCurlCommand(subscription);
  
    //       // Set your UI to show they have subscribed for
    //       // push messages
    //      // pushButton.textContent = 'Disable Push Messages';
    //     //  isPushEnabled = true;
    //     })
    //     .catch(function(err) {
    //       console.log('Error during getSubscription()', err);
    //     });
    // });
  }
}
