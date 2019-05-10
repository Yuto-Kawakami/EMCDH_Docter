import { Observable } from 'rxjs'
let request = require('request');
// let base_url = 'https://limitless-reef-40415.herokuapp.com/'
// let base_url = 'http://127.0.0.1:8000/'
// let base_url = 'http://172.26.30.20:8000/'
let base_url = 'https://radiant-basin-33136.herokuapp.com/'
// let Rx = require('rx');

// export default class Api {
class Api{
    getUser(){
        let endpoint = base_url + 'users/';
        return Observable.create(observer => {
            request.get(endpoint, (err, res, body) => {
                if(err) {
                    console.log('Error:' + err.message);
                    observer.next(false);
                    observer.complete();
                } else {
                    let json = JSON.parse(body)
                    console.log(json);
                    observer.next(json);
                    observer.complete();
                }
            });
        });
    }

    getLocation(user_id){
        let endpoint = base_url + 'locations/';
        let options = {
            url: endpoint,
            qs: {
                user: user_id,
            },
        };

        return Observable.create(observer => {
            request(options, (err, res, body) => {
                if(err){
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                }else {
                    let res = JSON.parse(body)[0];
                    if(!res){
                        observer.next(false);
                        observer.complete();
                    } else {
                        res['id'] = user_id;
                        res['timestamp'] = this.unixTime2ymd(res['timestamp']);
                        console.log(res)
                        observer.next(res);
                        observer.complete();
                    }
                }
            })
        });
    }

    getPregnancy(user_id){
        let endpoint = base_url + 'pregnancies/';
        let options = {
            url: endpoint,
            qs: {
                user: user_id,
            },
        };

        return Observable.create(observer => {
            request(options, (err, res, body) => {
                if(err){
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                }else {
                    let res = JSON.parse(body)[0];
                    if(!res){
                        observer.next(false);
                        observer.complete();
                    } else {
                        res['id'] = user_id;
                        console.log(res)
                        observer.next(res);
                        observer.complete();
                    }
                }
            })
        });
    }

    getGpac(user_id){
        let endpoint = base_url + 'gpacs/';
        let options = {
            url: endpoint,
            qs: {
                user: user_id,
            },
        };

        return Observable.create(observer => {
            request(options, (err, res, body) => {
                if(err){
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                }else {
                    let res = JSON.parse(body)[0];
                    if(!res){
                        observer.next(false);
                        observer.complete();
                    } else {
                        console.log(res)
                        observer.next(res);
                        observer.complete();
                    }
                }
            })
        });
    }

    getUserSummary(){
        let endpoint = base_url + 'user_summary/';
        let options = {
            url: endpoint,
        };

        return Observable.create(observer => {
            request(options, (err, res, body) => {
                if(err){
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                }else {
                    let res = JSON.parse(body)['data'];
                    if(!res){
                        observer.next(false);
                        observer.complete();
                    } else {
                        console.log(res)
                        observer.next(res);
                        observer.complete();
                    }
                }
            })
        });
    }

    geDetail(user_id) {
        //pregnancy
        this.getPregnancy(user_id).subscribe(data => {

        });
        //children


    }

    unixTime2ymd(intTime){
        let d = new Date();
        let year  = d.getFullYear();
        let month = d.getMonth() + 1;
        let day   = d.getDate();
        let hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
        let min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
        let sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
        let str = ( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
        return str
    }
}


let api = new Api();
export default api;
// api.getUser().subscribe(users => {
//     if(users){
//         for(let user of users) {
//             api.getLocation(user['id']).subscribe(data => {
//         });
//       }
//     }
//   });
