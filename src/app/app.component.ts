import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { CountryListService } from './services/country-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  dataList = [{ code: "AF", name: "Afghanistan", kanndaName: "ಅಫ್ಘಾನಿಸ್ತಾನ" }];
  private readonly publickKey = 'BEKTxkrXIIalE3tDElMvqga2dMHDygOT50tNj1P9o23v-tH_3lZjVSHjdsKC_Ectcr7-tD-rgFYjiOYPPDsjxGA';

  constructor(
    private countryList: CountryListService,
    private update: SwUpdate,
    private appRef: ApplicationRef,
    private swPush: SwPush
  ) {
    this.updatePage();
    // this.checkUpdate();
  }

  ngOnInit(): void {
    this.pushSubscription();
    this.swPush.notificationClicks.subscribe(
      ({action, notification}) => {
        window.open(notification.data.url);
      }
    )
    this.swPush.messages.subscribe(message => console.log(message));
    this.countryList.getCountryList().subscribe(
      (data: any) => {
        this.dataList = data.country;
      }
    );
  }

  updatePage = () => {
    if (!this.update.isEnabled) {
      console.log("Not enabled");
      return;
    }

    this.update.available.subscribe((event) => {
      console.log(`Current`, event.current, `Available`, event.available);
      if (confirm("Update available for the app")) {
        this.update.activateUpdate().then(() => {
          location.reload()
        });
      }
    })

    this.update.activated.subscribe((event) => {
      console.log(`Current`, event.previous, `Available`, event.current);
    })
  }

  // checkUpdate = () => {
  //   this.appRef.isStable.subscribe((isStable) => {
  //     if (isStable) {
  //       const timeIntervel = interval(20000);
  //       timeIntervel.subscribe(() => {
  //         this.update.checkForUpdate().then(() => console.log('checked'));
  //         console.log('Update check');
  //       });
  //     }
  //   });
  // }

  pushSubscription = () => {
    if (!this.swPush.isEnabled) {
      console.log('Notifications not enabled');
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.publickKey,
    })
      .then(sub => console.log(JSON.stringify(sub)))
      .catch(err => {
        console.log(err);
      });
  }
}
