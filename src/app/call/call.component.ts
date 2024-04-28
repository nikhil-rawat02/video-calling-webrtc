import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

declare var apiRTC: any;

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit {
  title = 'ApiRTC-angular';

  conversation: any;
  roomId!: string;
  loading: boolean = true;

  constructor(private location: Location) {}

  ngOnInit(): void {
    const path = this.location.path().split('/');

    this.roomId = path[path.length - 1];

    this.getOrCreateConversation();
  }

  getOrCreateConversation() {
    console.log(this.roomId)
    var localStream: any = null;

    //==============================
    // 1/ CREATE USER AGENT
    //==============================
    var ua = new apiRTC.UserAgent({
      uri: 'apzkey:2a2d711518e3f4ebfb5db515046f7816',
    });

    //==============================
    // 2/ REGISTER
    //==============================
    ua.register().then((session: any) => {
      this.loading = false;
      //==============================
      // 3/ CREATE CONVERSATION
      //==============================
      this.conversation = session.getConversation(this.roomId);

      //==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      //==========================================================
      this.conversation.on('streamListChanged', (streamInfo: any) => {
        console.log('streamListChanged :', streamInfo);
        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {
            this.conversation
              .subscribeToMedia(streamInfo.streamId)
              .then((stream: any) => {
                console.log('subscribeToMedia success');
              })
              .catch((err: any) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      //=====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE this.conversation
      //=====================================================
      this.conversation
        .on('streamAdded', (stream: any) => {
          stream.addInDiv(
            'remote-container',
            'remote-media-' + stream.streamId,
            {},
            false
          );
        })
        .on('streamRemoved', (stream: any) => {
          stream.removeFromDiv(
            'remote-container',
            'remote-media-' + stream.streamId
          );
        });

      //==============================
      // 5/ CREATE LOCAL STREAM
      //==============================
      ua.createStream({
        constraints: {
          audio: true,
          video: true,
        },
      })
        .then((stream: any) => {
          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media', {}, true);

          //==============================
          // 6/ JOIN this.conversation
          //==============================
          this.conversation
            .join()
            .then((response: any) => {
              //==============================
              // 7/ PUBLISH LOCAL STREAM
              //==============================
              this.conversation.publish(localStream);
            })
            .catch((err: any) => {
              console.error('this.conversation join error', err);
            });
        })
        .catch((err: any) => {
          console.error('create stream error', err);
        });
    });
  }

  leaveSession() {
    this.conversation.leave().then(() => {
      this.conversation.destroy();
    });
  }
}
