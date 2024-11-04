import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const WeeklyDetail = () => {
  const { year, week } = useParams();

  return (
    <Layout
      pageName="주간 상세 페이지"
      isBackBtnExist
      isSearchBtnExist
    ></Layout>
  );
};

export default WeeklyDetail;
