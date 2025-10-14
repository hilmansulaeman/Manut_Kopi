import imgImage7 from "figma:asset/53e55b2c35faf5ecabc7093a478eff530db255e5.png";
import imgImage8 from "figma:asset/1a994cd7b5672a0336d866bcdfc8b9776be29c11.png";

export default function MacBookAir1() {
  return (
    <div className="bg-[rgba(250,250,250,0.98)] relative size-full" data-name="MacBook Air - 1">
      <div className="absolute h-[832px] left-0 top-0 w-[262px]" data-name="image 7">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage7} />
      </div>
      <div className="absolute h-[832px] left-[262px] top-0 w-[1178px]" data-name="image 8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[100.61%] left-[-0.25%] max-w-none top-[-0.61%] w-[100.25%]" src={imgImage8} />
        </div>
      </div>
    </div>
  );
}