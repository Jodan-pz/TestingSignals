"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signalR = require("@aspnet/signalr");
const EventSource = require("eventsource");
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.WebSocket = require("websocket").client;
global.EventSource = EventSource;
global.btoa = require("btoa");
global.atob = require("atob");
const hubConnection = new signalR.HubConnection("http://localhost:5000/stocks", { transport: signalR.TransportType.WebSockets });
hubConnection.start().then(() => {
    hubConnection.invoke("GetMarketState").then(function (state) {
        if (state === "Open") {
            streamStocks();
        }
        else {
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
};
