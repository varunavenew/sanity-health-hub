#!/usr/bin/env npx tsx
/**
 * Sanity Migration: Privacy Policy Page
 *
 * Usage (from test/ directory):
 *   npx tsx sanity/migrate-privacy-policy.ts
 */

import { PROJECT_ID, DATASET, API_URL, SANITY_TOKEN as TOKEN } from "./config";

// Helper to create a Portable Text block
function textBlock(text: string, style: string = "normal"): any {
  return {
    _type: "block",
    _key: randomKey(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: randomKey(), text, marks: [] }],
  };
}

function strongTextBlock(parts: Array<{ text: string; strong?: boolean }>): any {
  const markDefs: any[] = [];
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs,
    children: parts.map((p) => ({
      _type: "span",
      _key: randomKey(),
      text: p.text,
      marks: p.strong ? ["strong"] : [],
    })),
  };
}

function linkBlock(textBefore: string, linkText: string, href: string, textAfter: string = ""): any {
  const markKey = randomKey();
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs: [{ _type: "link", _key: markKey, href }],
    children: [
      { _type: "span", _key: randomKey(), text: textBefore, marks: [] },
      { _type: "span", _key: randomKey(), text: linkText, marks: [markKey] },
      ...(textAfter ? [{ _type: "span", _key: randomKey(), text: textAfter, marks: [] }] : []),
    ],
  };
}

function listItem(text: string, level: number = 1): any {
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    listItem: "bullet",
    level,
    markDefs: [],
    children: [{ _type: "span", _key: randomKey(), text, marks: [] }],
  };
}

let keyCounter = 0;
function randomKey(): string {
  return `k${Date.now().toString(36)}${(keyCounter++).toString(36)}`;
}

// ============================================================
// PRIVACY POLICY BODY (Portable Text blocks)
// ============================================================

const body: any[] = [
  // --- Introduction ---
  textBlock("Introduction", "h2"),
  textBlock("You should be able to trust that we safeguard your privacy, are transparent about how we process your personal information, and that we handle your data in accordance with the applicable regulations at all times."),
  textBlock("The privacy statement contains information you are entitled to when information about you is collected, as well as general information about how we process personal data. When we use \"you\" in this statement, we refer to you as a customer, potential customer, or other contacts and collaborators for whom we have registered personal information."),
  textBlock("A \"personal information\" is any information or assessment that can be linked to you as an individual. It can be your name, contact information, or date of birth."),
  textBlock("\"Processing\" means any use of personal information, such as collection, registration, storage, modification, sharing, anonymization, deletion, etc."),
  textBlock("The Personal Data Act (which has implemented the General Data Protection Regulation) determines how we should process your personal information. There are specific requirements in the Personal Data Act regarding the processing of sensitive personal information, such as health information and medical assessments. In the law, such sensitive information is referred to as \"special categories of personal data.\""),
  textBlock("As a private healthcare facility, C-Medical must also adhere to the rules of the Health Act for the processing of personal information, in addition to other special laws. Relevant health laws include the Patient Records Act (with regulations), the Health Personnel Act, the Specialist Health Services Act, the Patient and User Rights Act, the Health Registry Act, and others. The Marketing Act and the Accounting Act are also examples of laws regulating C-Medical's processing of personal information."),

  // --- Data Controller ---
  textBlock("Data Controller", "h2"),
  textBlock("The data controller is the entity that determines the purpose of the processing of personal information and is responsible for ensuring that personal information is processed by applicable regulations."),
  textBlock("Within the C-Medical Group in Norway, the data controller for your health information will be the company within the group that processes personal information about you."),

  // --- Where We Obtain Your Information ---
  textBlock("Where We Obtain Your Information", "h2"),
  textBlock("The information we collect is received from you, among other things, through your conversations with healthcare professionals or through examinations and treatments you undergo with us."),
  textBlock("Information may also be collected from other healthcare entities that have treated you, such as your general practitioner, other hospitals, or from providers of X-ray/MR/CT and laboratory services. Additionally, we receive information from insurance companies when using health insurance, and we verify your address against the population register if you are a private customer."),
  textBlock("Some information is collected through the use of cookies when visiting our websites. You can read more about the use of cookies here."),

  // --- Categories of Processed Personal Information ---
  textBlock("Categories of Processed Personal Information", "h2"),
  textBlock("We only process personal information about you that is necessary to fulfill the purpose of the processing. We typically process the following categories of personal information:"),
  strongTextBlock([
    { text: "Administrative information ", strong: true },
    { text: "such as name, address, phone number, email, and social security number. Information about appointments. Payment information." },
  ]),
  strongTextBlock([
    { text: "Medical record information ", strong: true },
    { text: "such as medical history, previous treatments, medications you use, allergies, diagnoses, assessments, test results, images from X-rays/MRIs/CT scans, prescriptions, sick notes, and information about relatives, among others." },
  ]),
  strongTextBlock([
    { text: "Note: ", strong: true },
    { text: "When you are diagnosed, receive healthcare, or undergo medical treatment with us, we are obligated to record all information necessary to provide healthcare. This is done in our patient records system. Legal requirements dictate the contents of a patient record." },
  ]),
  strongTextBlock([
    { text: "Communication, ", strong: true },
    { text: "such as when you contact us in connection with treatment." },
  ]),
  strongTextBlock([
    { text: "Technical information ", strong: true },
    { text: "such as the type of PC/mobile device, internet connection, operating system, browser, and IP address. We collect this information through the use of cookies." },
  ]),
  textBlock("Providing personal information is voluntary, but failure to provide information may result in us being unable to deliver the services you desire."),

  // --- Purpose of Processing ---
  textBlock("Purpose of Processing Your Personal Information", "h2"),
  textBlock("We process your personal information for the following purposes:"),
  listItem("To identify you as a customer."),
  listItem("To provide proper healthcare and medical services."),
  listItem("Follow-up on potential and existing customer relationships."),
  listItem("Marketing our services through newsletters."),
  listItem("Ensuring information security by testing, improving, and developing our systems."),
  listItem("Continuously delivering high-quality healthcare services through the use of data."),
  listItem("Preventing and detecting illegal actions directed towards customers or C-Medical."),
  listItem("For accounting purposes."),
  listItem("For documentation purposes."),
  textBlock("The legal basis for processing personal information for purposes 1 and 3 is that the processing is necessary to administer the agreement with you regarding healthcare."),
  textBlock("The legal basis for processing personal information for purposes 2, 5, and 8 is that it is required by legal obligation."),
  textBlock("The legal basis for processing personal information for purposes 4 and 6 is your consent."),
  textBlock("The legal basis for processing personal information for purposes 7 and 9 is that it is required by legal obligation or a legitimate interest."),

  // --- Who We Share With ---
  textBlock("Who We Share Your Personal Information With", "h2"),
  textBlock("Healthcare Facilities or Other Healthcare Professionals", "h3"),
  textBlock("We share your health information with healthcare facilities, referring physicians, or other healthcare professionals who are also providing you with medical treatment if we are contacted with requests to disclose your patient information. This is done when it is necessary to provide you with proper healthcare, and it involves sharing necessary information with collaborating healthcare professionals who are subject to the same confidentiality requirements as C-Medical employees. As a patient, you have the right to object to such disclosure, as stipulated by the Healthcare Personnel Act."),
  textBlock("Public Authorities", "h3"),
  textBlock("We disclose personal information to public authorities if required by law or in cases where there is suspicion of a violation of the law in connection with the use of our services."),
  textBlock("Public Health Registries", "h3"),
  textBlock("We share information that we are obligated to share with public health registries, such as the cancer registry."),
  textBlock("Data Processors", "h3"),
  textBlock("We further share personal information with our subcontractors who perform tasks and services on our behalf. In such cases, a separate data processing agreement is entered into, ensuring that the personal information transferred and processed is not used for purposes other than delivering the agreed-upon service. We use subcontractors for various tasks, including the operation and maintenance of IT systems and solutions."),
  textBlock("Our subcontractors are primarily located and process personal information within the EU/EEA, meaning that these data processors are subject to the same regulations regarding the processing of personal information. In individual cases, data processors processing personal information outside the EU/EEA may be used. In such cases, we ensure that the processing is subject to an adequate level of protection."),
  textBlock("Sharing of personal information may also occur in the event of a business transfer, such as a merger or other restructuring of C-Medical."),

  // --- Security ---
  textBlock("How We Ensure the Security of Your Personal Information", "h2"),
  textBlock("To protect your personal information, we implement necessary physical, technical, and administrative measures, such as securing premises and infrastructure."),
  textBlock("In accordance with healthcare personnel regulations, our employees are bound by confidentiality regarding information concerning your health and the dialogues you have with us as a patient. For medical records, unauthorized individuals are prevented from accessing your information through various security measures, including access controls."),
  textBlock("Subcontractors processing personal information on our behalf must also have implemented adequate security measures and are bound by confidentiality."),
  textBlock("To ensure the security and confidentiality of your health information, it is important that communication with you is secure. Therefore, you should not send health information or other sensitive details to us via email or social media. Instead, please contact us by phone, through mail, or in person."),
  textBlock("The exchange of personal information with insurance companies occurs via dedicated and encrypted lines, complying with requirements and standards."),

  // --- Retention ---
  textBlock("How Long We Retain Your Information", "h2"),
  textBlock("We process information about you for as long as necessary to achieve the purpose for which it was collected. The information is then anonymized or deleted unless we are obligated to continue preserving information according to applicable laws, or there is another basis for further processing."),
  textBlock("We do not delete information if there are outstanding or unresolved issues between you as a customer and C-Medical."),
  textBlock("Administrative Information", "h3"),
  textBlock("Information related to the administration of contractual relationships is retained as long as we have a valid basis for processing and the information is considered necessary to preserve. After that, it will be deleted or anonymized so that it can no longer be linked to you as an individual. For example, payment information is retained for five years after the expiration of the last fiscal year, as required by the Accounting Act and regulations."),
  textBlock("Patient Records", "h3"),
  textBlock("The general rule is that patient records should be kept as long as there is a presumed need for them due to the nature of healthcare. We generally retain records for 10 years. As long as the patient record exists, associated patient contact information is also retained."),
  textBlock("Documentation", "h3"),
  textBlock("Some personal information will be kept for documentation purposes. This applies, for example, to consents that have been in effect or information necessary to establish, enforce, or defend legal claims."),

  // --- Digital Communication ---
  textBlock("Digital Communication", "h2"),
  textBlock("How you can communicate with us digitally may vary from clinic to clinic."),
  textBlock("Appointment Booking", "h3"),
  textBlock("We have a form for appointment booking where you can enter your information and send us a request for an examination. Text information is automatically deleted after 21 days, while contact data is automatically deleted after five months."),
  textBlock("SMS and Email", "h3"),
  textBlock("Correspondence via email and SMS is deleted at the end of each month. Health information that needs to be preserved is transferred to the journal system."),

  // --- Your Rights ---
  textBlock("Your Rights", "h2"),
  textBlock("You have statutory rights under the Personal Data Act. If you wish to exercise your rights, please contact the clinic you have been in contact with."),
  textBlock("Access", "h3"),
  textBlock("You have the right to receive information about the personal information we process about you and how we use it."),
  textBlock("You have the right to access your patient record, as well as information about who has accessed your patient record and who has received information from it."),
  textBlock("Rectification", "h3"),
  textBlock("You have the right to have your personal information corrected if it is incorrect or inaccurate. It is important that the information we have about you is correct, so, for example, we do not send invoices and other information to the wrong email address. If you discover an error, please contact us so that we can correct the information."),
  textBlock("For information in the patient record, the right to have information corrected is limited by rules in the Healthcare Personnel Act. If we do not agree on corrections, you can request a note in the journal stating that you, as a patient, believe there is incorrect or misleading information in your journal."),
  textBlock("Deletion", "h3"),
  textBlock("You have the right to have personal information deleted when it is no longer necessary to process it for the purpose for which it was collected, or you withdraw your consent to the processing. This applies unless there is another legal basis for processing. Similarly, you have the right to have any information processed on an illegal basis deleted."),
  textBlock("You do not have the right to delete information processed based on a legal obligation. The same applies to information necessary to establish, enforce, or defend legal claims."),
  textBlock("For information in patient records, the right to have information deleted is very limited due to rules in the Healthcare Personnel Act."),
  textBlock("Data Portability", "h3"),
  textBlock("In principle, you should be able to take your personal information from us to another similar entity. The right to portability only applies to information that you have provided to us yourself and that is used to fulfill an agreement, or information based on consent. You can request such information to be delivered or sent directly to your new medical provider."),
  textBlock("The majority of the processing C-Medical does with personal information is justified by a legal obligation to provide healthcare and is not subject to the right to data portability. Therefore, your ability to request delivery/transfer has no impact on our obligation to retain your patient record."),
  textBlock("Objection", "h3"),
  textBlock("In certain cases, you have the right to object to the processing of your personal information. This does not apply to treatments related to delivering the services covered by your contractual relationship or purposes necessary to operate and manage your agreement."),
  textBlock("Right to Restrict Processing", "h3"),
  textBlock("You have the right to demand that our processing of personal information about you be restricted. You can request this if:"),
  listItem("You believe that the personal information we have stored about you is inaccurate."),
  listItem("You believe that our processing of personal information about you is unlawful."),
  listItem("We no longer need the personal information, but you need it to establish or enforce legal claims."),

  // --- Consent ---
  textBlock("Consent", "h2"),
  textBlock("Health Insurance", "h3"),
  textBlock("For the follow-up of insurance matters, we need your consent to exchange health information with your insurance company."),
  textBlock("Obtaining Relevant Information from Public or Private Healthcare Providers", "h3"),
  textBlock("You can give your consent for C-Medical to obtain relevant patient information from other public or private healthcare providers when necessary for your treatment."),
  textBlock("Quality Registry – Research", "h3"),
  textBlock("You can also give your consent to use your health information and medical data for quality assurance purposes so that we can track your progress to develop and improve our services. Your data will be anonymized when extracted from the medical record and stored in the quality registry."),
  textBlock("Newsletter", "h3"),
  textBlock("You can choose to give your consent to receive newsletters related to our services via email. As a patient, you can give your consent directly to the clinic. You can also subscribe to our newsletter through our website, regardless of who you are. We record your name and email address for the newsletter distribution. You also consent to us measuring the open rate and clicks on links in the newsletter. The newsletter contains information about our healthcare services and is sent out 4-12 times a year. You can unsubscribe from the newsletter at any time by clicking on the unsubscribe link in the latest newsletter."),
  textBlock("You can withdraw your consent at any time if you wish. Withdrawing consent will not affect the legality of processing based on previous consent."),

  // --- Contact ---
  textBlock("Contact Us Regarding Privacy Matters", "h2"),
  textBlock("If you have questions about our processing of personal information, you can contact the clinic manager at the clinic you have been in contact with. You are entitled to a response without undue delay, and no later than one month, if the question concerns your rights under the Personal Data Act."),
  linkBlock("C-Medical's Data Protection Officer, Gisle Kjøsen, can be reached at: ", "personvernombud@cmedical.no", "mailto:personvernombud@cmedical.no"),

  // --- Complaints ---
  textBlock("Right to Complain", "h2"),
  textBlock("If you have received a final rejection of a complaint regarding C-Medical's processing of your personal information and believe that we do not respect your rights under the Personal Data Act, you have the option to complain to the Norwegian Data Protection Authority (Datatilsynet)."),

  // --- Changes ---
  textBlock("Implementation of Changes to this Statement", "h2"),
  textBlock("We will periodically update this privacy statement to keep you informed about how we process your personal information."),
  textBlock("December 2023"),

  // --- Cookie Policy ---
  textBlock("Cookie Policy", "h2"),
  textBlock("This website uses cookies. We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic. We also share information about how you use our site with our social media, advertising, and analytics partners, who may combine it with other information you've provided to them or that they've collected from your use of their services."),
  textBlock("Cookies are small text files that can be used by websites to make a user's experience more efficient."),
  textBlock("The law states that we can store cookies on your device if they are strictly necessary for the operation of this site. For all other types of cookies, we need your permission."),
  textBlock("This website uses different types of cookies. Some cookies are placed by third-party services that appear on our pages."),
  textBlock("You can change or withdraw your consent via the Cookie Declaration on our website."),
  textBlock("Please read our Privacy Policy to learn more about who we are, how you can contact us, and how we process personal data."),
];

// ============================================================
// MIGRATION
// ============================================================

async function migrate() {
  console.log("🚀 Migrating Privacy Policy page to Sanity...\n");

  const mutations = [
    {
      createOrReplace: {
        _id: "privacyPolicyPage",
        _type: "privacyPolicyPage",
        title: "Privacy policy",
        slug: { _type: "slug", current: "privacy-policy" },
        body,
      },
    },
  ];

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }

  const result = await res.json();
  console.log("✅ Privacy Policy page migrated successfully!");
  console.log(`   Documents affected: ${result.results?.length || 0}`);
}

migrate().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
