import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoCallComponent } from './video-call/video-call.component';
import { CallComponent } from './call/call.component';

const routes: Routes = [
  {path: 'video-call' , component: VideoCallComponent},
  {path: 'call/:roomId', component: CallComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {



}
