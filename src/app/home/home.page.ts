import {Component, OnInit} from '@angular/core';
import {Echo} from 'laravel-echo-ionic';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    echo: any = null;
    apiUrl: any = 'http://blog.loc';
    message: string;
    messages: any = [];

    ngOnInit() {
        console.log('ok');
        this.http.post(`${this.apiUrl}/api/messages`, {})
            .subscribe((response: any) => {
                this.messages = response;
            });
    }

    constructor(
        private http: HttpClient
    ) {
        this.echo = new Echo({
            broadcaster: 'socket.io',
            host: 'http://chat-laravel.loc:6001',
        });

        this.echo.connector.socket.on('connect', () => console.log('CONNECTED'));

        // this.echo.connector.socket.on('reconnecting', () => console.log('CONNECTING') );
        //
        // this.echo.connector.socket.on('disconnect', () => console.log('DISCONNECTED'));

        this.echo.channel('chat1')
            .listen('.server.created', (data) => {
                if (data.name.type !== 'angular') {
                    this.messages.push(data.name);
                }
            });
    }

    sendMessage() {
        const type = 'angular';
        this.messages.push({message: this.message, type});
        this.http.post(`${this.apiUrl}/api/send`, {message: this.message, type})
            .subscribe((response: any) => {
                this.message = '';
            });
    }

    getClasses(messageType) {
        return {
            incoming: messageType === 'angular',
            outgoing: messageType === null,
        };
    }

}
