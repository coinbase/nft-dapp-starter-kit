import styles from "@styles/Home.module.css";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

const FAQ = () => {
  const faqData = [
    {
      question: "What is the Non-Fungible Coinbae project?",
      answer:
        "The non-fungible Coinbae project is a sample dapp that showcases a frontend boilerplate for a generic NFT minting project that can be built with the `NFT Dapp Starter Kit`.",
    },
    {
      question: "How can I build something like this of my own?",
      answer:
        "Go fork the `NFT Dapp Starter Kit` source code to kick start your own project! Don't forget to share your project on Twitter and tag @CoinbaseWallet, we'd love to see what you build:)",
    },
    {
      question:
        "If I have questions or run into any issues, where can I ask them?",
      answer:
        "Add your questions to the `Issues` page on our Github repository. We'll try to get back to you as soon as possible!",
    },
  ];

  return (
    <div id="faq">
      <div className={styles.container}>
        <main className={styles.mainPadding}>
          <h1 className={styles.title}>FAQ</h1>
          <div className={styles.content}>
            <Accordion sx={{ width: "100%" }} allowToggle>
              {faqData.map((faq, idx) => {
                return (
                  <AccordionItem key={idx}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <p style={{ fontWeight: "bold", fontSize: 18 }}>
                            {faq.question}
                          </p>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <p> {faq.answer}</p>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;
