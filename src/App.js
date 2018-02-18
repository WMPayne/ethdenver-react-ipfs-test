'use strict'
const React = require('react')
const ipfsAPI = require('ipfs-api')


class App extends React.Component {
  constructor () {
    super()
    this.state = {
      added_file_hash: null
    }
    this.ipfsApi = ipfsAPI({host: 'hackathon.paynelabs.net', port: '5001', protocol: 'http'})

    // bind methods
    this.captureFile = this.captureFile.bind(this)
    this.saveToIpfs = this.saveToIpfs.bind(this)
    this.arrayBufferToString = this.arrayBufferToString.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  captureFile (event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.onloadend = () => this.saveToIpfs(reader)
    reader.readAsArrayBuffer(file)
  }

  saveToIpfs (reader) {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({added_file_hash: ipfsId})
      }).catch((err) => {
        console.error(err)
      })
  }

  arrayBufferToString (arrayBuffer) {
    return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer))
  }

  handleSubmit (event) {
    event.preventDefault()
  }


  render () {
    return (
      <div>
        <form id='captureMedia' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile} />
        </form>
        <div>
          <a target='_blank'
            href={'http://hackathon.paynelabs.net:5001/api/v0/get/' + this.state.added_file_hash}>
            {this.state.added_file_hash}
          </a>
        </div>

      </div>
    )
  }
}
module.exports = App
