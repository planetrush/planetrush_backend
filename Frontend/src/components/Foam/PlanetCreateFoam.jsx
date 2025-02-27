import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/PlanetCreateForm.css";

const PlanetCreateForm = () => {
  const navigate = useNavigate();

  //이미지 받아옴
  const location = useLocation();
  const { savedImage } = location.state || {};

  //행성 정보 받을 위치
  const [planetInfo, setPlanetInfo] = useState({
    name: "",
    content: "",
    category: "",
    startDate: "",
    endDate: "",
    maxParticipants: 2,
    authCond: "",
    missionFile: null,
    missionUrl: "",
    planetImgUrl: savedImage ? savedImage.planetImgUrl : "",
    planetImg: savedImage ? savedImage.custumImg : null,
  });

  //에러출력
  const [errors, setErrors] = useState({
    name: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    if (savedImage) {
      setPlanetInfo((prevState) => ({
        ...prevState,
        planetImgUrl: savedImage.planetImgUrl || "",
        planetImg: savedImage.custumImg || null,
      }));
    }
  }, [savedImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPlanetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    //이름 설정시
    if (name === "name" && value.length > 10) {
      setErrors((prevState) => ({
        ...prevState,
        name: "10자 이하로 적어주세요",
      }));
    } else if (name === "name") {
      setErrors((prevState) => ({
        ...prevState,
        name: "",
      }));
    }

    //챌린지명 설정시
    if (name === "content" && value.length > 20) {
      setErrors((prevState) => ({
        ...prevState,
        content: "20자 이하로 적어주세요",
      }));
    } else if (name === "content") {
      setErrors((prevState) => ({
        ...prevState,
        content: "",
      }));
    }

    // 미션 조건 설정시
    if (name === "authCond" && value.length > 30) {
      setErrors((prevState) => ({
        ...prevState,
        authCond: "30자 이하로 적어주세요",
      }));
    } else if (name === "authCond") {
      setErrors((prevState) => ({
        ...prevState,
        authCond: "",
      }));
    }
  };

  //인원수 체크
  const handlePeopleCountChange = (increment) => {
    setPlanetInfo((prevState) => ({
      ...prevState,
      maxParticipants: Math.min(
        Math.max(prevState.maxParticipants + increment, 2),
        10
      ),
    }));
  };

  //인증 사진 파일 업로드
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const missionUrl = URL.createObjectURL(file);

      setPlanetInfo((prevState) => ({
        ...prevState,
        missionFile: file,
        missionUrl: missionUrl,
      }));
    }
  };

  //인증 업로드 누르기 - 파일 업로드 창 띄우기
  const handleUploadButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  //유효 기간 체크
  const validateDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    const weekFromToday = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

    if (start < today || start > weekFromToday) {
      setErrors((prevState) => ({
        ...prevState,
        date: "시작일은 오늘부터 2주일 이내여야 합니다.",
      }));

      setPlanetInfo((prevState) => ({
        ...prevState,
        startDate: "",
      }));

      return false;
    } else if (end <= start) {
      setErrors((prevState) => ({
        ...prevState,
        date: "종료일은 시작일 이후여야 합니다.",
      }));

      setPlanetInfo((prevState) => ({
        ...prevState,
        endDate: "",
      }));

      return false;
    } else if (end - start < 4 * 24 * 60 * 60 * 1000) {
      setErrors((prevState) => ({
        ...prevState,
        date: "기간은 최소 5일 이상이어야 합니다.",
      }));

      return false;
    } else if (end - start > 10 * 24 * 60 * 60 * 1000) {
      setErrors((prevState) => ({
        ...prevState,
        date: "기간은 최대 10일이어야 합니다.",
      }));

      return false;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        date: "",
      }));

      return true;
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    setPlanetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    name;
    if (name === "startDate" || name === "endDate") {
      validateDate(
        name === "startDate" ? value : planetInfo.startDate,
        name === "endDate" ? value : planetInfo.endDate
      );
    }
  };

  //제출하기 누르면
  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력 값 유효성 검사
    if (planetInfo.name.trim() === "") {
      alert("행성 이름을 입력해주세요.");
      return;
    }

    if (planetInfo.category === "") {
      alert("카테고리를 설정해주세요");
      return;
    }

    if (planetInfo.content.trim() === "") {
      alert("챌린지명을 입력해주세요.");
      return;
    }

    if (!planetInfo.startDate || !planetInfo.endDate) {
      alert("기간을 설정해주세요.");
      return;
    }

    if (planetInfo.missionFile === null) {
      alert("인증 사진을 업로드해주세요.");
      return;
    }

    if (errors.date) {
      alert("기간을 확인해주세요.");
      return;
    }

    submitResult();
  };

  //최종제출
  const submitResult = () => {
    let imgFile = planetInfo.planetImg;

    // 만약 planetImg가 data URL 형식이라면 이를 File 객체로 변환
    if (
      typeof planetInfo.planetImg === "string" &&
      planetInfo.planetImg.startsWith("data:image")
    ) {
      imgFile = dataURLtoFile(planetInfo.planetImg, "custom-image.png");
    }

    // navigate로 페이지를 이동하면서 imgFile을 사용
    navigate("/result", {
      state: {
        planetInfo: {
          ...planetInfo,
          planetImgUrl: imgFile
            ? URL.createObjectURL(imgFile)
            : planetInfo.planetImgUrl,
          planetImg: imgFile, // 변환된 File 객체 또는 원본 이미지
        },
      },
    });
  };

  // data URL을 File 객체로 변환하는 함수 추가
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="planet-create-container">
      <h3>행성 정보를 입력해주세요</h3>
      <form onSubmit={handleSubmit} className="planet-form">
        <div className="form-group">
          <label>행성 이름</label>
          <input
            type="text"
            name="name"
            value={planetInfo.name}
            onChange={handleInputChange}
            placeholder="10자 이내로 작성해주세요"
            maxLength={10}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>챌린지명</label>
          <input
            type="text"
            name="content"
            value={planetInfo.content}
            onChange={handleInputChange}
            placeholder="20자 이내로 작성해주세요"
            maxLength={20}
          />
          {errors.content && <p className="error">{errors.content}</p>}
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <div id="category">
            <label>
              <input
                type="radio"
                name="category"
                value="EXERCISE"
                checked={planetInfo.category === "EXERCISE"}
                onChange={handleInputChange}
              />
              <span>운동</span>
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="LIFE"
                checked={planetInfo.category === "LIFE"}
                onChange={handleInputChange}
              />
              <span>생활</span>
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="BEAUTY"
                checked={planetInfo.category === "BEAUTY"}
                onChange={handleInputChange}
              />
              <span>미용</span>
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="STUDY"
                checked={planetInfo.category === "STUDY"}
                onChange={handleInputChange}
              />
              <span>학습</span>
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="ETC"
                checked={planetInfo.category === "ETC"}
                onChange={handleInputChange}
              />
              <span>기타</span>
            </label>
          </div>
        </div>
        <div className="form-group date-group">
          <label>기간</label>
          <div className="date-inputs">
            <input
              type="date"
              name="startDate"
              value={planetInfo.startDate}
              onChange={handleDateChange}
              min={getTodayDate()}
            />
            <span>부터</span>
            <input
              type="date"
              name="endDate"
              value={planetInfo.endDate}
              onChange={handleDateChange}
              min={getTodayDate()}
            />
            <span>까지</span>
          </div>
          {errors.date && <p className="error">{errors.date}</p>}
        </div>
        <div className="form-group-people-count">
          <label>인원 수</label>
          <div className="count-control">
            <button type="button" onClick={() => handlePeopleCountChange(-1)}>
              -
            </button>
            <input
              type="number"
              name="peopleCount"
              value={planetInfo.maxParticipants}
              readOnly
            />
            <button type="button" onClick={() => handlePeopleCountChange(1)}>
              +
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>미션 조건</label>
          <input
            type="text"
            name="authCond"
            value={planetInfo.authCond}
            onChange={handleInputChange}
          />
        </div>
        {errors.content && <p className="error">{errors.content}</p>}
        <div className="form-group">
          <label>인증 사진 업로드</label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="upload-button"
            onClick={handleUploadButtonClick}
          >
            사진 찍으러가기
          </button>
          {planetInfo.missionUrl && (
            <img
              src={planetInfo.missionUrl}
              accept=".jpg,.jpeg,.png"
              alt="선택된 사진"
              className="image-preview"
            />
          )}
        </div>
        <button type="submit" className="submit-button">
          창조하기
        </button>
      </form>
    </div>
  );
};

export default PlanetCreateForm;
