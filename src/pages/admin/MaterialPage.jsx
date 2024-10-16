import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ButtonContainer from '../../components/admin/ButtonContainer';
import DuplicateContainer from '../../components/admin/DuplicateContainer';
import unitsData from '../../assets/data/units.json';
import categoriesData from '../../assets/data/categories.json';
import materialsData from '../../assets/data/materials.json'; // 재료 데이터

const MaterialPage = () => {
  const handleItemClick = (item) => {

  };

  return (
    <AdminLayout>
      <h2>재료 이름</h2>
      <DuplicateContainer
        data={materialsData}
        placeholder="재료 이름을 입력하세요"
      />

      <br/>

      <h2>재료 단위</h2><br/> 
      <ButtonContainer
        items={unitsData.map((unit) => ({ ...unit, type: 'unit' }))}
        onItemClick={handleItemClick}
      />

      <br />

      <h2>카테고리</h2><br/> 
      <ButtonContainer
        items={categoriesData.map((category) => ({ ...category, type: 'category' }))}
        onItemClick={handleItemClick}
      />
    </AdminLayout>
  );
};

export default MaterialPage;

