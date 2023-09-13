import "./App.css";
import { useState } from "react";
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

	const onChangeSelectHandler = (e) => {
		setCode(e.target.value);
	};

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
        {/* split("<br>")을 기준으로 작성하면 더 편리하게 css 작업가능 */}
				{mealData.DDISH_NM ? (
					<div
						className="mealdata"
						dangerouslySetInnerHTML={{ __html: mealData.DDISH_NM }}
					></div>
				) : (
					<div className="mealno">급식 데이터가 존재하지 않습니다</div>
				)}
			</div>
		</div>
	);
}

export default App;
