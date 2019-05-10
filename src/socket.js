import io from 'socket.io-client'

// let socket = io.connect("http://localhost:3001")
let socket = io.connect("http://ec2-54-199-199-19.ap-northeast-1.compute.amazonaws.com:3013/")

export default socket