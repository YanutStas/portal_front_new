import React, { useEffect, useState } from "react";
import { Typography, Card, Flex, Modal, Button, Image } from "antd";
import useSubjects from "../../../stores/Cabinet/useSubjects";
import styles from "./Subjects.module.css";
import { PlusOutlined } from "@ant-design/icons";
import SceletonCard from "../../../components/SceletonCard";
import ModalFizLica from "../../../components/Cabinet/Subjects/ModalFizLica/ModalFizLica";
import AppHelmet from "../../../components/Global/AppHelmet";
import ModalUrLica from "../../../components/Cabinet/Subjects/ModalUrLica/ModalUrLica";
import person from "../../../img/subjects/person3.svg";
import organization from "../../../img/subjects/organization.svg";
import ModalIP from "../../../components/Cabinet/Subjects/ModalIP/ModalIP";

const { Title } = Typography;
const { Meta } = Card;

const stylesForCard = {
  body: {
    height: "100%",
    width: 250,
    minHeight: 250,
  },
  actions: { marginTop: "-20px" },
  header: { backgroundColor: "red" },
};

export default function Subjects() {
  const [showModalUrAdd, setShowModalUrAdd] = useState(false);
  const [showModalIPAdd, setShowModalIPAdd] = useState(false);

  // Модалка добавления физ лица
  const showModalAdd = useSubjects((state) => state.showModalAdd);
  const setShowModalAdd = useSubjects((state) => state.setShowModalAdd);

  // Модалка просмотра физ лица
  const showModalView = useSubjects((state) => state.showModalView);
  const showSubject = useSubjects((state) => state.showSubject);

  // Модалка просмотра ИП
  const showModalIPView = useSubjects((state) => state.showModalIPView);

  // Модалка просмотра Юр лиц
  const showModalYurView = useSubjects((state) => state.showModalYurView);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const subject = useSubjects((state) => state.subject);
  const subjects = useSubjects((state) => state.subjects);
  const isLoadingSubjects = useSubjects((state) => state.isLoadingSubjects);
  const fetchSubjects = useSubjects((state) => state.fetchSubjects);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      fetchSubjects();
    }
  }, [fetchSubjects]);

  const handleCategorySelect = (type) => {
    setShowCategoryModal(false);
    setSelectedType(type); // Сохраняем выбранный тип
    if (type === "individual") {
      setShowModalAdd(true);
    } else if (type === "legalEntity") {
      setShowModalUrAdd(true);
      // Для других типов (ИП, Юр.Лицо) может быть своя логика soleProprietor
    } else if (type === "soleProprietor") {
      setShowModalIPAdd(true);
    }
  };

  return (
    <div>
      <AppHelmet title={"Субъекты"} desc={"Субъекты"} />
      <Title level={1}>Субъекты</Title>
      {isLoadingSubjects && <SceletonCard />}

      <Flex wrap="wrap" gap="large">
        {subjects.map((subject) => (
          <Card
            hoverable
            key={subject.id}
            styles={stylesForCard}
            className={styles.subjectCard}
            onClick={() => {
              showSubject(subject.id);
            }}
          >
            <Typography.Title level={5} className={styles.subjectCardTitle}>
              {subject?.attributes.name}
            </Typography.Title>
            <Meta description={subject?.attributes.type} />
            <Flex justify="flex-end" className={styles.subjectCardImage}>
              <Image
                width={"50%"}
                src={
                  subject?.attributes.type === "Физическое лицо"
                    ? person
                    : organization
                }
                preview={false}
              />
            </Flex>
          </Card>
        ))}
        <Card
          hoverable
          styles={stylesForCard}
          className={styles.subjectCard}
          onClick={() => setShowCategoryModal(true)}
        >
          <Flex
            align="stretch"
            justify="center"
            style={{ minHeight: "100%", width: "100%" }}
          >
            <PlusOutlined />
          </Flex>
        </Card>
      </Flex>

      <Modal
        title="Выберите тип субъекта"
        open={showCategoryModal}
        onCancel={() => setShowCategoryModal(false)}
        footer={null}
        width={700}
        name="type"
      >
        <Flex gap="large" wrap="wrap" justify="center">
          <Button
            className={styles.buttontypenewsubject}
            onClick={() => handleCategorySelect("individual")}
          >
            Физическое
            <br /> лицо
          </Button>
          <Button
            className={styles.buttontypenewsubject}
            onClick={() => handleCategorySelect("legalEntity")}
          >
            Юридическое
            <br /> лицо
          </Button>
          <Button
            className={styles.buttontypenewsubject}
            onClick={() => handleCategorySelect("soleProprietor")}
          >
            Индивидуальный
            <br /> предприниматель
          </Button>
        </Flex>
      </Modal>

      {/* Модалка для добавления физ.лица */}
      <Modal
        title="Добавление физического лица"
        open={showModalAdd}
        onCancel={() => setShowModalAdd(false)}
        width={650}
        footer={null}
      >
        <ModalFizLica
          onSubmit={() => setShowModalAdd(false)}
          setShowModal={setShowModalAdd}
          type={selectedType}
        />
      </Modal>

      {/* Модалка для добавления юр.лица */}
      <Modal
        title="Добавление юридического лица"
        open={showModalUrAdd}
        onCancel={() => setShowModalUrAdd(false)}
        width={650}
        footer={null}
      >
        <ModalUrLica
          onSubmit={() => setShowModalUrAdd(false)}
          setShowModal={setShowModalUrAdd}
          type={selectedType}
        />
      </Modal>

      {/* Модалка для добавления ИП */}
      <Modal
        title="Добавление ИП"
        open={showModalIPAdd}
        onCancel={() => setShowModalIPAdd(false)}
        width={650}
        footer={null}
      >
        <ModalIP
          onSubmit={() => setShowModalIPAdd(false)}
          setShowModal={setShowModalIPAdd}
          type={selectedType}
        />
      </Modal>

      {/* Модалка для просмотра физ.лица */}
      <Modal
        title="Просмотр физического лица"
        open={showModalView}
        onCancel={() => showSubject(false)}
        width={650}
        footer={null}
      >
        <ModalFizLica
          read
          value={{
            ...subject,
          }}
          //onSubmit={() => setShowModalAdd(false)}
          setShowModal={showSubject}
          type={selectedType}
        />
      </Modal>

      {/* Модалка для просмотра ИП*/}
      <Modal
        title="Просмотр ИП"
        open={showModalIPView}
        onCancel={() => showSubject(false)}
        width={650}
        footer={null}
      >
        <ModalIP
          read
          value={{
            ...subject,
          }}
          setShowModal={showSubject}
          type={selectedType}
        />
      </Modal>

      {/* Модалка для просмотра юр лиц*/}
      <Modal
        title="Просмотр юридического лица"
        open={showModalYurView}
        onCancel={() => showSubject(false)}
        width={650}
        footer={null}
      >
        <ModalUrLica
          read
          value={{
            ...subject,
          }}
          setShowModal={showSubject}
          type={selectedType}
        />
      </Modal>
    </div>
  );
}
