export const initmaps = (google) => {
    const dummyDiv = document.createElement("div");
    this.map = new google.maps.Map(dummyDiv);
    this.initAutocomplete();
};