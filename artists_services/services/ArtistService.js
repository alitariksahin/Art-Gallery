const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);

class ArtistService {

  constructor(datafile) {
    this.datafile = datafile;
  }

  async getNames() {
    const data = await this.getData();
    const names = [];
    data.forEach(artist => {
      names.push({
        name: artist.name,
        shortname: artist.shortname,
      });
    });
    return names;
  }

  async getAllArtwork() {
    const data = await this.getData();
    const artworks = [];
    data.forEach(artist => {
      if (artist.artwork) {
        artworks.push(...artist.artwork);
      }
    });
    return artworks;
  }

  async getArtworkForArtist(shortname) {
    const data = await this.getData();
    let artworks = [];
    data.forEach(artist => {
      if (artist.shortname === shortname) {
        artworks = [...artist.artwork];
      }
    });
    return artworks;
  }


  async getArtist(shortname) {
    const data = await this.getData();
    let oneArtist = {};
    data.forEach(artist => {
      if (artist.shortname === shortname) {
        oneArtist = {
          title: artist.title,
          name: artist.name,
          shortname: artist.shortname,
          description: artist.description,
        };
      }
    });
    return oneArtist;
  }

  async getListShort() {
    const data = await this.getData();
    const listShort = [];
    data.forEach(artist => {
      listShort.push({
        name: artist.name,
        shortname: artist.shortname,
        title: artist.title,
      });
    });
    return listShort;
  }

  async getList() {
    const data = await this.getData();
    let list = [];
    data.forEach(artist => {
      list.push({
        name: artist.name,
        shortname: artist.shortname,
        title: artist.title,
        summary: artist.summary,
      });
    });
    return list;
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data).artists;
  }

  async subscribeEvents(payload) {
    const event = payload;

    switch(event) {
      case "GETNAMES":
        const names = await this.getNames();
        return names;
      case "GETALLARTWORK":
        const allArtwork = await this.getAllArtwork();
        return allArtwork;
      case "GETLISTSHORT":
        const listShort= await this.getListShort();
        return listShort;
      case "GETLIST":
        const list= await this.getList();
        return list;
    }
    return {msg: "no such event or artist"};

  }
}

module.exports = ArtistService;
