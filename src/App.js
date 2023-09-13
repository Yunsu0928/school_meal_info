import "./App.css";
import { useEffect, useState } from "react";
import cityCode from "./data/cityCode";
import main from "./assets/main_logo.png";

function App() {
	const serviceKey = process.env.REACT_APP_SERVICE_KEY;
	const serviceKey2 = process.env.REACT_APP_SERVICE_KEY2;
	const [code, setCode] = useState("");
	const [search, setSearch] = useState("");
	const [data, setData] = useState([]);
	const [schCode, setSchCode] = useState("");
	const [date, setDate] = useState("20230915");
	const [mealData, setMealData] = useState("");
	// 학교기본정보
	// https://open.neis.go.kr/hub/schoolInfo?KEY=${serviceKey}&Type=json&pIndex=1&pSize=1000&ATPT_OFCDC_SC_CODE=${cityCode[0]}
	// console.log(Object.keys(cityCode));

	// TODO: api받아오기, cityCode랑 검색input 둘다에 맞는 데이터 받아와서 dropdown2에 넣어주기
	// select에있는 코드값을 useState에 넣어주기
	// Object.Entries >> 값이 배열 안에 또 배열로 들어오는데, 그 배열의 첫번째 요소가 키고 두번쨰 요소가 값이다 >> 선택되는것의 value는 코드값이어야 하니까
	// 검색기능

	// console.log(mealData);

	const onChangeSelectHandler = (e) => {
		setCode(e.target.value);
	};
	// console.log(search);

	const onChangeInputHandler = (e) => {
		setSearch(e.target.value);
	};

	const onClickBtnHandler = (e) => {
		if (search.length === 0) {
			alert("지역과 학교명을 입력해주세요");
		}
		if (code && search) {
			fetch(
				`https://open.neis.go.kr/hub/schoolInfo?KEY=${serviceKey2}&Type=json&pIndex=1&pSize=1000&ATPT_OFCDC_SC_CODE=${code}&SCHUL_NM=${search}`
			)
				.then((res) => res.json())
				.then((res) => {
					setData(res.schoolInfo[1].row);
					// console.log(res.schoolInfo[1].row);
				});
		}
	};

	const onClickBtnMealHandler = () => {
		fetch(
			`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${serviceKey}&Type=json&pIndex=1&pSize=500&ATPT_OFCDC_SC_CODE=${code}&SD_SCHUL_CODE=${schCode}&MLSV_YMD=${date
				.split("-")
				.join("")}`
		)
			.then((res) => res.json())
			.then((res) => {
				console.log(res.mealServiceDietInfo[1].row[0]);
				setMealData(res.mealServiceDietInfo[1].row[0]);
			});
	};

	return (
		<div className="container">
			<div className="innerContainer">
				<div className="logo">
					<img src={main} />
				</div>
				<div className="section1">
					<p>지역과 학교를 선택해주세요</p>
					<div className="searchbox">
						<select className="dropdown" onChange={onChangeSelectHandler}>
							<option value="" selected>
								지역을 선택해주세요
							</option>
							{Object.entries(cityCode).map((e) => (
								<option key={e[1]} value={e[1]}>
									{e[0]}
								</option>
							))}
						</select>
						<input
							className="input"
							placeholder="학교명을 입력해주세요"
							type="text"
							value={search}
							onChange={onChangeInputHandler}
						/>
						<button onClick={onClickBtnHandler}>학교 검색</button>
					</div>
					<div className="result">
						{/* <p>학교 검색 결과</p> */}
						<select
							className="dropdown2"
							onChange={(e) => {
								setSchCode(e.target.value);
							}}
						>
							<option value="" selected>
								학교를 선택해주세요
							</option>
							{data.map((e) => (
								<option value={e.SD_SCHUL_CODE}>{e.SCHUL_NM}</option>
							))}
						</select>
					</div>
				</div>
				<div className="section2">
					<p>날짜를 선택해주세요</p>
					<input
						className="inputdate"
						type="date"
						max="20250620"
						min="20220605"
						value={date}
						onChange={(e) => {
							setDate(e.target.value);
						}}
					/>
				</div>
				<button className="mealbtn" onClick={onClickBtnMealHandler}>
					급식 검색
				</button>
				{mealData.DDISH_NM ? (
					<div
						className="mealdata"
						dangerouslySetInnerHTML={{ __html: mealData.DDISH_NM }}
					></div>
				) : (
					<div className="mealno">급식 데이터가 존재하지 않습니다</div>
				)}
				{/* <div dangerouslySetInnerHTML={{ __html: mealData.DDISH_NM }}>
					{mealData.DDISH_NM.split("<br>").map((e) => (
						<div>{e}</div>
					))}
				</div> */}
			</div>
		</div>
	);
}

export default App;
