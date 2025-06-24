"use client";

import CustomAvatar from "@/@core/components/mui/Avatar";
import { Button, Divider } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import SwiperControls from "./components/swiper";
import FileUploaderRestrictions from "./components/FileUploaderRestrictions";

const IMEI = "1735781913";
const SERVER_ADDRESS = "https://juice-box.info";
// const SERVER_ADDRESS = "http://127.0.0.1:8080";

export type Video = {
  version: number;
  url: string;
  seq: number;
  playoutTime: number;
  [key: string]: any; // Optional: To allow additional properties
};

export type Config = {
  code: string;
  mediaType: string;
  mediaPath: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  videoList: Video[];
};

export default function Page() {
  // States
  const [imageList, setImageList] = useState<Array<string>>([]);

  async function fetchScreenResources() {
    try {
      const response = await fetch(
        `${SERVER_ADDRESS}/v1/stations/${IMEI}/interview_get_screen_resources`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      data.adConfigList[0].videoList =
        data.adConfigList[0].videoList.sort(
          (a: any, b: any) => a.seq - b.seq
        ) || [];
      const urls = data.adConfigList[0].videoList.map(
        (video: Video) => video.url
      );
      setImageList(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  const handleDeleteScreenResource = async () => {
    try {
      const response = await fetch(
        `${SERVER_ADDRESS}/v1/stations/${IMEI}/interview_screen_resources/9998`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchScreenResources();
    } catch (error) {
      console.error(
        `Error deleting resource with from station with imei=${IMEI} : `,
        error
      );
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    if (files.length === 0) {
      alert("请选择要上传的文件");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("imei", IMEI);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("resources", file, file.name);
      }
      
      const response = await fetch(
        `${SERVER_ADDRESS}/v1/stations/${IMEI}/interview_upload_screen_resources`,
        {
          method: "POST",
          headers: {},
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 上传成功后重新获取图片列表，更新Part 1和Part 2
      await fetchScreenResources();
      alert("图片上传成功！");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("图片上传失败，请重试");
    }
  };

  useEffect(() => {
    fetchScreenResources();
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="mbe-2">
          {/* 下面这个div里是part 1 header，不需要改动，但是可以做为part 2 header的参考。
          part2 header只需要替换tabler-brand-youtube为样例中的图片icon， 这个icon可以在https://tabler.io/icons里通过关键词搜索找到，找到一个类似的即可。*/}
          <div className="flex gap-3 items-center mbe-2">
            <CustomAvatar
              color="primary"
              variant="rounded"
              size={30}
              skin="filled"
            >
              <i className="tabler-brand-youtube"></i>
            </CustomAvatar>
            <Typography variant="h5">Screen and Advertising</Typography>
          </div>
          <div className="flex flex-col gap-4 mbe-2">
            <Divider />
            <div className="flex">
              <div className="w-1/2" style={{ aspectRatio: '4/5', overflow: 'hidden', position: 'relative' }}>
                <SwiperControls images={imageList} />
              </div>
              <div className="w-1/2" style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
                <img 
                  src="https://bajie-machines.s3.us-east-1.amazonaws.com/common/screen_right_side.png" 
                  alt="Right side screen" 
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center mbe-2">
              <CustomAvatar
                color="primary"
                variant="rounded"
                size={30}
                skin="filled"
              >
                <i className="tabler-photo"></i>
              </CustomAvatar>
              <Typography variant="h5">Uploaded Resources</Typography>
            </div>
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-4">
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {imageList.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-[5/4]"
                  >
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <FileUploaderRestrictions onUpload={handleUploadFiles} />
          </div>
          {/* 不要改动这个button，仅供调试使用。 */}
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleDeleteScreenResource}
          >
            delete all images
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

