import nyanLoader from "../../assets/nyan-loader.gif";

function NyanLoader({ className }) {
  return (
    <img src={nyanLoader} alt="nyan loader animation" className={className} />
  );
}

export default NyanLoader;
