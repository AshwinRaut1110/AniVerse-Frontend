import nyanLoader from "../../assets/nyan-loader.gif";
// import nyanLoader from "../../assets/nyancat.svg";

function NyanLoader({ className }) {
  return (
    <img src={nyanLoader} alt="nyan loader animation" className={className} />
  );
}

export default NyanLoader;
