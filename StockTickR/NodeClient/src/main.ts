import * as signalR from "@aspnet/signalr";
import * as EventSource from "eventsource";

(<any>global).XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
(<any>global).WebSocket = require("websocket").client;
(<any>global).EventSource = EventSource;
(<any>global).btoa = require("btoa");
(<any>global).atob = require("atob");

const hubConnection: signalR.HubConnection = new signalR.HubConnection("http://localhost:5000/stocks", { transport: signalR.TransportType.WebSockets });

hubConnection.start().then(() => {
    hubConnection.invoke("GetMarketState").then(function (state: string): void {
        if (state === "Open") {
            streamStocks();
        } else {
            hubConnection.invoke("OpenMarket");
        }
    });
}).catch(process.stderr.write);

hubConnection.on("marketOpened", () => streamStocks());

const streamStocks = () => {
    hubConnection.stream("StreamStocks").subscribe({
        next: process.stdout.write,
        error: () => { },
        complete: () => { }
    });
}