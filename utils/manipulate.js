import moment from "moment";
import relativeDate from "relative-date";

class Manipulations {
  getRelativeDate(date) {
    date *= 1000;
    let formatedDate = relativeDate(new Date(date));
    return formatedDate;
  }
  border() {
    return {
      borderColor: "black",
      borderWidth: 1,
      borderStyle: "solid",
    };
  }
  getPostCategories() {
    return [
      "Math",
      "Philosophy",
      "Languages",
      "Sciences",
      "History",
      "Arts",
      "Law",
      "IT",
      "Business",
    ];
  }
  getExamTypes() {
    return ["CAT", "RAT", "Quiz", "Assignment", "End of Semester exam"];
  }

  getUserAvatar(all = false) {
    let allAvatars = [
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg1.png?alt=media&token=3de00467-7c23-49e1-818b-3206fd67a31d",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg2.png?alt=media&token=0d75bc55-3ee3-4200-9984-649f9c0a0242",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg3.png?alt=media&token=f6ce462b-45f3-47ed-b180-98b08e1d7d6c",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg4.png?alt=media&token=b70ac975-835c-4f43-a6c7-5dc9b0b35fc9",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg5.png?alt=media&token=cd09f397-1263-45f7-8879-dfa179d1d61e",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg6.png?alt=media&token=8bdd5962-52f5-4946-aca1-d5dfe2e0cab7",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg7.png?alt=media&token=94e9f7ba-7cbf-41a7-92d3-05cd3219046d",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg8.png?alt=media&token=571ddf3d-abf8-4b7c-94cd-33e850bfc1d7",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg9.png?alt=media&token=930e6889-0e0f-40a9-8ce6-4fc440781271",
      "https://firebasestorage.googleapis.com/v0/b/educate-6542c.appspot.com/o/userAvatars%2Fimg10.png?alt=media&token=07258c6e-a302-4354-95e3-113c2e2cef25",
    ];
    if (all) return allAvatars;
    return allAvatars[Math.floor(Math.random() * allAvatars.length)];
  }
}
const manipulations = new Manipulations();
export default manipulations;
