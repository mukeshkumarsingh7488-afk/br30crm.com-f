import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useRef, useState } from "react";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Sales Manager",
    text: "BR30 CRM gives our sales team a much clearer view of every opportunity and follow-up.",
  },
  {
    name: "Priya Mehta",
    role: "Business Owner",
    text: "Having customers, deals and daily activities organized in one place has made our workflow much simpler.",
  },
  {
    name: "Rahul Verma",
    role: "Operations Lead",
    text: "Our team can finally work from the same information without maintaining multiple spreadsheets.",
  },
  {
    name: "Neha Kapoor",
    role: "Growth Manager",
    text: "The CRM keeps our leads organized and makes it easier to understand what needs attention next.",
  },
  {
    name: "Vikram Singh",
    role: "Founder",
    text: "BR30 CRM gives us a clean overview of customers and business activity without unnecessary complexity.",
  },
  {
    name: "Ananya Patel",
    role: "Sales Executive",
    text: "Managing follow-ups has become much easier because everything is available from one workspace.",
  },
  {
    name: "Rohan Gupta",
    role: "Business Development",
    text: "The pipeline view helps our team understand where every opportunity stands at a glance.",
  },
  {
    name: "Simran Kaur",
    role: "Customer Success Lead",
    text: "Having customer information and activities connected together makes our daily work much more organized.",
  },
  {
    name: "Aditya Malhotra",
    role: "Startup Founder",
    text: "It feels simple enough for the whole team while still giving us the visibility we need as we grow.",
  },
  {
    name: "Karan Mehta",
    role: "Sales Lead",
    text: "Our team spends less time searching for information and more time actually working with customers.",
  },
  {
    name: "Isha Verma",
    role: "Operations Manager",
    text: "The unified workspace gives everyone a better understanding of what is happening across the business.",
  },
  {
    name: "Manish Kumar",
    role: "Business Owner",
    text: "A clean CRM that keeps our leads, contacts, deals and activities connected in one place.",
  },
  ,
  {
    name: "Aarav Sharma",
    role: "Sales Manager — Andhra Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Aditi Joshi",
    role: "Growth Manager — Arunachal Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aditya Das",
    role: "Business Development Manager — Assam",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Akash Pandey",
    role: "Marketing Manager — Bihar",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aman Menon",
    role: "Support Manager — Chhattisgarh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Amit Patel",
    role: "Product Manager — Goa",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Ananya Reddy",
    role: "Operations Lead — Gujarat",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Arjun Bansal",
    role: "Sales Executive — Haryana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Bhavna Shah",
    role: "Operations Manager — Himachal Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Chetan Kumar",
    role: "Revenue Lead — Jharkhand",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Deepak Mishra",
    role: "CRM Administrator — Karnataka",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Diya Saxena",
    role: "Business Owner — Kerala",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Gaurav Kulkarni",
    role: "Founder — Madhya Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Isha Verma",
    role: "Customer Success Lead — Maharashtra",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Karan Kapoor",
    role: "Account Manager — Manipur",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Kavya Roy",
    role: "Team Lead — Meghalaya",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Manish Yadav",
    role: "Sales Manager — Mizoram",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Meera Rao",
    role: "Growth Manager — Nagaland",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Mohit Mehta",
    role: "Business Development Manager — Odisha",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Neha Nair",
    role: "Marketing Manager — Punjab",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Nikhil Sinha",
    role: "Support Manager — Rajasthan",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Nisha Iyer",
    role: "Product Manager — Sikkim",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Pooja Singh",
    role: "Operations Lead — Tamil Nadu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Prakash Jain",
    role: "Sales Executive — Telangana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Priya Agarwal",
    role: "Operations Manager — Tripura",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rahul Desai",
    role: "Revenue Lead — Uttar Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Raj Gupta",
    role: "CRM Administrator — Uttarakhand",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rakesh Malhotra",
    role: "Business Owner — West Bengal",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Riya Chauhan",
    role: "Founder — Andaman and Nicobar Islands",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rohan Tiwari",
    role: "Customer Success Lead — Chandigarh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sakshi Sharma",
    role: "Account Manager — Dadra and Nagar Haveli and Daman and Diu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Sameer Joshi",
    role: "Team Lead — Delhi",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sanjay Das",
    role: "Sales Manager — Jammu and Kashmir",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Shreya Pandey",
    role: "Growth Manager — Ladakh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Simran Menon",
    role: "Business Development Manager — Lakshadweep",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Sonal Patel",
    role: "Marketing Manager — Puducherry",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sourav Reddy",
    role: "Support Manager — Andhra Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Tanvi Bansal",
    role: "Product Manager — Arunachal Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Varun Shah",
    role: "Operations Lead — Assam",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Vikas Kumar",
    role: "Sales Executive — Bihar",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Vikram Mishra",
    role: "Operations Manager — Chhattisgarh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Yash Saxena",
    role: "Revenue Lead — Goa",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aarav Kulkarni",
    role: "CRM Administrator — Gujarat",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Aditi Verma",
    role: "Business Owner — Haryana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aditya Kapoor",
    role: "Founder — Himachal Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Akash Roy",
    role: "Customer Success Lead — Jharkhand",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aman Yadav",
    role: "Account Manager — Karnataka",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Amit Rao",
    role: "Team Lead — Kerala",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Ananya Mehta",
    role: "Sales Manager — Madhya Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Arjun Nair",
    role: "Growth Manager — Maharashtra",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Bhavna Sinha",
    role: "Business Development Manager — Manipur",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Chetan Iyer",
    role: "Marketing Manager — Meghalaya",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Deepak Singh",
    role: "Support Manager — Mizoram",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Diya Jain",
    role: "Product Manager — Nagaland",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Gaurav Agarwal",
    role: "Operations Lead — Odisha",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Isha Desai",
    role: "Sales Executive — Punjab",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Karan Gupta",
    role: "Operations Manager — Rajasthan",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Kavya Malhotra",
    role: "Revenue Lead — Sikkim",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Manish Chauhan",
    role: "CRM Administrator — Tamil Nadu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Meera Tiwari",
    role: "Business Owner — Telangana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Mohit Sharma",
    role: "Founder — Tripura",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Neha Joshi",
    role: "Customer Success Lead — Uttar Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Nikhil Das",
    role: "Account Manager — Uttarakhand",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Nisha Pandey",
    role: "Team Lead — West Bengal",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Pooja Menon",
    role: "Sales Manager — Andaman and Nicobar Islands",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Prakash Patel",
    role: "Growth Manager — Chandigarh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Priya Reddy",
    role: "Business Development Manager — Dadra and Nagar Haveli and Daman and Diu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rahul Bansal",
    role: "Marketing Manager — Delhi",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Raj Shah",
    role: "Support Manager — Jammu and Kashmir",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rakesh Kumar",
    role: "Product Manager — Ladakh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Riya Mishra",
    role: "Operations Lead — Lakshadweep",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rohan Saxena",
    role: "Sales Executive — Puducherry",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sakshi Kulkarni",
    role: "Operations Manager — Andhra Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Sameer Verma",
    role: "Revenue Lead — Arunachal Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sanjay Kapoor",
    role: "CRM Administrator — Assam",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Shreya Roy",
    role: "Business Owner — Bihar",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Simran Yadav",
    role: "Founder — Chhattisgarh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Sonal Rao",
    role: "Customer Success Lead — Goa",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sourav Mehta",
    role: "Account Manager — Gujarat",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Tanvi Nair",
    role: "Team Lead — Haryana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Varun Sinha",
    role: "Sales Manager — Himachal Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Vikas Iyer",
    role: "Growth Manager — Jharkhand",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Vikram Singh",
    role: "Business Development Manager — Karnataka",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Yash Jain",
    role: "Marketing Manager — Kerala",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aarav Agarwal",
    role: "Support Manager — Madhya Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Aditi Desai",
    role: "Product Manager — Maharashtra",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aditya Gupta",
    role: "Operations Lead — Manipur",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Akash Malhotra",
    role: "Sales Executive — Meghalaya",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aman Chauhan",
    role: "Operations Manager — Mizoram",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Amit Tiwari",
    role: "Revenue Lead — Nagaland",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Ananya Sharma",
    role: "CRM Administrator — Odisha",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Arjun Joshi",
    role: "Business Owner — Punjab",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Bhavna Das",
    role: "Founder — Rajasthan",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Chetan Pandey",
    role: "Customer Success Lead — Sikkim",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Deepak Menon",
    role: "Account Manager — Tamil Nadu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Diya Patel",
    role: "Team Lead — Telangana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Gaurav Reddy",
    role: "Sales Manager — Tripura",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Isha Bansal",
    role: "Growth Manager — Uttar Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Karan Shah",
    role: "Business Development Manager — Uttarakhand",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Kavya Kumar",
    role: "Marketing Manager — West Bengal",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Manish Mishra",
    role: "Support Manager — Andaman and Nicobar Islands",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Meera Saxena",
    role: "Product Manager — Chandigarh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Mohit Kulkarni",
    role: "Operations Lead — Dadra and Nagar Haveli and Daman and Diu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Neha Verma",
    role: "Sales Executive — Delhi",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Nikhil Kapoor",
    role: "Operations Manager — Jammu and Kashmir",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Nisha Roy",
    role: "Revenue Lead — Ladakh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Pooja Yadav",
    role: "CRM Administrator — Lakshadweep",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Prakash Rao",
    role: "Business Owner — Puducherry",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Priya Mehta",
    role: "Founder — Andhra Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rahul Nair",
    role: "Customer Success Lead — Arunachal Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Raj Sinha",
    role: "Account Manager — Assam",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rakesh Iyer",
    role: "Team Lead — Bihar",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Riya Singh",
    role: "Sales Manager — Chhattisgarh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rohan Jain",
    role: "Growth Manager — Goa",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sakshi Agarwal",
    role: "Business Development Manager — Gujarat",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Sameer Desai",
    role: "Marketing Manager — Haryana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sanjay Gupta",
    role: "Support Manager — Himachal Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Shreya Malhotra",
    role: "Product Manager — Jharkhand",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Simran Chauhan",
    role: "Operations Lead — Karnataka",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Sonal Tiwari",
    role: "Sales Executive — Kerala",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sourav Sharma",
    role: "Operations Manager — Madhya Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Tanvi Joshi",
    role: "Revenue Lead — Maharashtra",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Varun Das",
    role: "CRM Administrator — Manipur",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Vikas Pandey",
    role: "Business Owner — Meghalaya",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Vikram Menon",
    role: "Founder — Mizoram",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Yash Patel",
    role: "Customer Success Lead — Nagaland",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aarav Reddy",
    role: "Account Manager — Odisha",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Aditi Bansal",
    role: "Team Lead — Punjab",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aditya Shah",
    role: "Sales Manager — Rajasthan",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Akash Kumar",
    role: "Growth Manager — Sikkim",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aman Mishra",
    role: "Business Development Manager — Tamil Nadu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Amit Saxena",
    role: "Marketing Manager — Telangana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Ananya Kulkarni",
    role: "Support Manager — Tripura",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Arjun Verma",
    role: "Product Manager — Uttar Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Bhavna Kapoor",
    role: "Operations Lead — Uttarakhand",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Chetan Roy",
    role: "Sales Executive — West Bengal",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Deepak Yadav",
    role: "Operations Manager — Andaman and Nicobar Islands",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Diya Rao",
    role: "Revenue Lead — Chandigarh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Gaurav Mehta",
    role: "CRM Administrator — Dadra and Nagar Haveli and Daman and Diu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Isha Nair",
    role: "Business Owner — Delhi",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Karan Sinha",
    role: "Founder — Jammu and Kashmir",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Kavya Iyer",
    role: "Customer Success Lead — Ladakh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Manish Singh",
    role: "Account Manager — Lakshadweep",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Meera Jain",
    role: "Team Lead — Puducherry",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Mohit Agarwal",
    role: "Sales Manager — Andhra Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Neha Desai",
    role: "Growth Manager — Arunachal Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Nikhil Gupta",
    role: "Business Development Manager — Assam",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Nisha Malhotra",
    role: "Marketing Manager — Bihar",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Pooja Chauhan",
    role: "Support Manager — Chhattisgarh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Prakash Tiwari",
    role: "Product Manager — Goa",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Priya Sharma",
    role: "Operations Lead — Gujarat",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rahul Joshi",
    role: "Sales Executive — Haryana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Raj Das",
    role: "Operations Manager — Himachal Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rakesh Pandey",
    role: "Revenue Lead — Jharkhand",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Riya Menon",
    role: "CRM Administrator — Karnataka",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rohan Patel",
    role: "Business Owner — Kerala",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sakshi Reddy",
    role: "Founder — Madhya Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Sameer Bansal",
    role: "Customer Success Lead — Maharashtra",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sanjay Shah",
    role: "Account Manager — Manipur",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Shreya Kumar",
    role: "Team Lead — Meghalaya",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Simran Mishra",
    role: "Sales Manager — Mizoram",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Sonal Saxena",
    role: "Growth Manager — Nagaland",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sourav Kulkarni",
    role: "Business Development Manager — Odisha",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Tanvi Verma",
    role: "Marketing Manager — Punjab",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Varun Kapoor",
    role: "Support Manager — Rajasthan",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Vikas Roy",
    role: "Product Manager — Sikkim",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Vikram Yadav",
    role: "Operations Lead — Tamil Nadu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Yash Rao",
    role: "Sales Executive — Telangana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aarav Mehta",
    role: "Operations Manager — Tripura",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Aditi Nair",
    role: "Revenue Lead — Uttar Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aditya Sinha",
    role: "CRM Administrator — Uttarakhand",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Akash Iyer",
    role: "Business Owner — West Bengal",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aman Singh",
    role: "Founder — Andaman and Nicobar Islands",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Amit Jain",
    role: "Customer Success Lead — Chandigarh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Ananya Agarwal",
    role: "Account Manager — Dadra and Nagar Haveli and Daman and Diu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Arjun Desai",
    role: "Team Lead — Delhi",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Bhavna Gupta",
    role: "Sales Manager — Jammu and Kashmir",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Chetan Malhotra",
    role: "Growth Manager — Ladakh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Deepak Chauhan",
    role: "Business Development Manager — Lakshadweep",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Diya Tiwari",
    role: "Marketing Manager — Puducherry",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Gaurav Sharma",
    role: "Support Manager — Andhra Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Isha Joshi",
    role: "Product Manager — Arunachal Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Karan Das",
    role: "Operations Lead — Assam",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Kavya Pandey",
    role: "Sales Executive — Bihar",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Manish Menon",
    role: "Operations Manager — Chhattisgarh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Meera Patel",
    role: "Revenue Lead — Goa",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Mohit Reddy",
    role: "CRM Administrator — Gujarat",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Neha Bansal",
    role: "Business Owner — Haryana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Nikhil Shah",
    role: "Founder — Himachal Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Nisha Kumar",
    role: "Customer Success Lead — Jharkhand",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Pooja Mishra",
    role: "Account Manager — Karnataka",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Prakash Saxena",
    role: "Team Lead — Kerala",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Priya Kulkarni",
    role: "Sales Manager — Madhya Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rahul Verma",
    role: "Growth Manager — Maharashtra",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Raj Kapoor",
    role: "Business Development Manager — Manipur",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rakesh Roy",
    role: "Marketing Manager — Meghalaya",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Riya Yadav",
    role: "Support Manager — Mizoram",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rohan Rao",
    role: "Product Manager — Nagaland",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sakshi Mehta",
    role: "Operations Lead — Odisha",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Sameer Nair",
    role: "Sales Executive — Punjab",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sanjay Sinha",
    role: "Operations Manager — Rajasthan",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Shreya Iyer",
    role: "Revenue Lead — Sikkim",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Simran Singh",
    role: "CRM Administrator — Tamil Nadu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Sonal Jain",
    role: "Business Owner — Telangana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sourav Agarwal",
    role: "Founder — Tripura",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Tanvi Desai",
    role: "Customer Success Lead — Uttar Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Varun Gupta",
    role: "Account Manager — Uttarakhand",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Vikas Malhotra",
    role: "Team Lead — West Bengal",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Vikram Chauhan",
    role: "Sales Manager — Andaman and Nicobar Islands",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Yash Tiwari",
    role: "Growth Manager — Chandigarh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aarav Sharma",
    role: "Business Development Manager — Dadra and Nagar Haveli and Daman and Diu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Aditi Joshi",
    role: "Marketing Manager — Delhi",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aditya Das",
    role: "Support Manager — Jammu and Kashmir",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Akash Pandey",
    role: "Product Manager — Ladakh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aman Menon",
    role: "Operations Lead — Lakshadweep",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Amit Patel",
    role: "Sales Executive — Puducherry",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Ananya Reddy",
    role: "Operations Manager — Andhra Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Arjun Bansal",
    role: "Revenue Lead — Arunachal Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Bhavna Shah",
    role: "CRM Administrator — Assam",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Chetan Kumar",
    role: "Business Owner — Bihar",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Deepak Mishra",
    role: "Founder — Chhattisgarh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Diya Saxena",
    role: "Customer Success Lead — Goa",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Gaurav Kulkarni",
    role: "Account Manager — Gujarat",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Isha Verma",
    role: "Team Lead — Haryana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Karan Kapoor",
    role: "Sales Manager — Himachal Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Kavya Roy",
    role: "Growth Manager — Jharkhand",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Manish Yadav",
    role: "Business Development Manager — Karnataka",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Meera Rao",
    role: "Marketing Manager — Kerala",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Mohit Mehta",
    role: "Support Manager — Madhya Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Neha Nair",
    role: "Product Manager — Maharashtra",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Nikhil Sinha",
    role: "Operations Lead — Manipur",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Nisha Iyer",
    role: "Sales Executive — Meghalaya",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Pooja Singh",
    role: "Operations Manager — Mizoram",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Prakash Jain",
    role: "Revenue Lead — Nagaland",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Priya Agarwal",
    role: "CRM Administrator — Odisha",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rahul Desai",
    role: "Business Owner — Punjab",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Raj Gupta",
    role: "Founder — Rajasthan",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rakesh Malhotra",
    role: "Customer Success Lead — Sikkim",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Riya Chauhan",
    role: "Account Manager — Tamil Nadu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rohan Tiwari",
    role: "Team Lead — Telangana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sakshi Sharma",
    role: "Sales Manager — Tripura",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Sameer Joshi",
    role: "Growth Manager — Uttar Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sanjay Das",
    role: "Business Development Manager — Uttarakhand",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Shreya Pandey",
    role: "Marketing Manager — West Bengal",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Simran Menon",
    role: "Support Manager — Andaman and Nicobar Islands",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Sonal Patel",
    role: "Product Manager — Chandigarh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sourav Reddy",
    role: "Operations Lead — Dadra and Nagar Haveli and Daman and Diu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Tanvi Bansal",
    role: "Sales Executive — Delhi",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Varun Shah",
    role: "Operations Manager — Jammu and Kashmir",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Vikas Kumar",
    role: "Revenue Lead — Ladakh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Vikram Mishra",
    role: "CRM Administrator — Lakshadweep",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Yash Saxena",
    role: "Business Owner — Puducherry",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aarav Kulkarni",
    role: "Founder — Andhra Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Aditi Verma",
    role: "Customer Success Lead — Arunachal Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aditya Kapoor",
    role: "Account Manager — Assam",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Akash Roy",
    role: "Team Lead — Bihar",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aman Yadav",
    role: "Sales Manager — Chhattisgarh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Amit Rao",
    role: "Growth Manager — Goa",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Ananya Mehta",
    role: "Business Development Manager — Gujarat",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Arjun Nair",
    role: "Marketing Manager — Haryana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Bhavna Sinha",
    role: "Support Manager — Himachal Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Chetan Iyer",
    role: "Product Manager — Jharkhand",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Deepak Singh",
    role: "Operations Lead — Karnataka",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Diya Jain",
    role: "Sales Executive — Kerala",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Gaurav Agarwal",
    role: "Operations Manager — Madhya Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Isha Desai",
    role: "Revenue Lead — Maharashtra",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Karan Gupta",
    role: "CRM Administrator — Manipur",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Kavya Malhotra",
    role: "Business Owner — Meghalaya",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Manish Chauhan",
    role: "Founder — Mizoram",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Meera Tiwari",
    role: "Customer Success Lead — Nagaland",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Mohit Sharma",
    role: "Account Manager — Odisha",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Neha Joshi",
    role: "Team Lead — Punjab",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Nikhil Das",
    role: "Sales Manager — Rajasthan",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Nisha Pandey",
    role: "Growth Manager — Sikkim",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Pooja Menon",
    role: "Business Development Manager — Tamil Nadu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Prakash Patel",
    role: "Marketing Manager — Telangana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Priya Reddy",
    role: "Support Manager — Tripura",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rahul Bansal",
    role: "Product Manager — Uttar Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Raj Shah",
    role: "Operations Lead — Uttarakhand",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rakesh Kumar",
    role: "Sales Executive — West Bengal",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Riya Mishra",
    role: "Operations Manager — Andaman and Nicobar Islands",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rohan Saxena",
    role: "Revenue Lead — Chandigarh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sakshi Kulkarni",
    role: "CRM Administrator — Dadra and Nagar Haveli and Daman and Diu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Sameer Verma",
    role: "Business Owner — Delhi",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sanjay Kapoor",
    role: "Founder — Jammu and Kashmir",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Shreya Roy",
    role: "Customer Success Lead — Ladakh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Simran Yadav",
    role: "Account Manager — Lakshadweep",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Sonal Rao",
    role: "Team Lead — Puducherry",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sourav Mehta",
    role: "Sales Manager — Andhra Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Tanvi Nair",
    role: "Growth Manager — Arunachal Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Varun Sinha",
    role: "Business Development Manager — Assam",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Vikas Iyer",
    role: "Marketing Manager — Bihar",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Vikram Singh",
    role: "Support Manager — Chhattisgarh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Yash Jain",
    role: "Product Manager — Goa",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aarav Agarwal",
    role: "Operations Lead — Gujarat",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Aditi Desai",
    role: "Sales Executive — Haryana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aditya Gupta",
    role: "Operations Manager — Himachal Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Akash Malhotra",
    role: "Revenue Lead — Jharkhand",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aman Chauhan",
    role: "CRM Administrator — Karnataka",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Amit Tiwari",
    role: "Business Owner — Kerala",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Ananya Sharma",
    role: "Founder — Madhya Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Arjun Joshi",
    role: "Customer Success Lead — Maharashtra",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Bhavna Das",
    role: "Account Manager — Manipur",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Chetan Pandey",
    role: "Team Lead — Meghalaya",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Deepak Menon",
    role: "Sales Manager — Mizoram",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Diya Patel",
    role: "Growth Manager — Nagaland",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Gaurav Reddy",
    role: "Business Development Manager — Odisha",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Isha Bansal",
    role: "Marketing Manager — Punjab",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Karan Shah",
    role: "Support Manager — Rajasthan",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Kavya Kumar",
    role: "Product Manager — Sikkim",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Manish Mishra",
    role: "Operations Lead — Tamil Nadu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Meera Saxena",
    role: "Sales Executive — Telangana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Mohit Kulkarni",
    role: "Operations Manager — Tripura",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Neha Verma",
    role: "Revenue Lead — Uttar Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Nikhil Kapoor",
    role: "CRM Administrator — Uttarakhand",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Nisha Roy",
    role: "Business Owner — West Bengal",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Pooja Yadav",
    role: "Founder — Andaman and Nicobar Islands",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Prakash Rao",
    role: "Customer Success Lead — Chandigarh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Priya Mehta",
    role: "Account Manager — Dadra and Nagar Haveli and Daman and Diu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rahul Nair",
    role: "Team Lead — Delhi",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Raj Sinha",
    role: "Sales Manager — Jammu and Kashmir",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rakesh Iyer",
    role: "Growth Manager — Ladakh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Riya Singh",
    role: "Business Development Manager — Lakshadweep",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rohan Jain",
    role: "Marketing Manager — Puducherry",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sakshi Agarwal",
    role: "Support Manager — Andhra Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Sameer Desai",
    role: "Product Manager — Arunachal Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sanjay Gupta",
    role: "Operations Lead — Assam",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Shreya Malhotra",
    role: "Sales Executive — Bihar",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Simran Chauhan",
    role: "Operations Manager — Chhattisgarh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Sonal Tiwari",
    role: "Revenue Lead — Goa",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sourav Sharma",
    role: "CRM Administrator — Gujarat",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Tanvi Joshi",
    role: "Business Owner — Haryana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Varun Das",
    role: "Founder — Himachal Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Vikas Pandey",
    role: "Customer Success Lead — Jharkhand",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Vikram Menon",
    role: "Account Manager — Karnataka",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Yash Patel",
    role: "Team Lead — Kerala",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aarav Reddy",
    role: "Sales Manager — Madhya Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Aditi Bansal",
    role: "Growth Manager — Maharashtra",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aditya Shah",
    role: "Business Development Manager — Manipur",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Akash Kumar",
    role: "Marketing Manager — Meghalaya",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aman Mishra",
    role: "Support Manager — Mizoram",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Amit Saxena",
    role: "Product Manager — Nagaland",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Ananya Kulkarni",
    role: "Operations Lead — Odisha",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Arjun Verma",
    role: "Sales Executive — Punjab",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Bhavna Kapoor",
    role: "Operations Manager — Rajasthan",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Chetan Roy",
    role: "Revenue Lead — Sikkim",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Deepak Yadav",
    role: "CRM Administrator — Tamil Nadu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Diya Rao",
    role: "Business Owner — Telangana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Gaurav Mehta",
    role: "Founder — Tripura",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Isha Nair",
    role: "Customer Success Lead — Uttar Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Karan Sinha",
    role: "Account Manager — Uttarakhand",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Kavya Iyer",
    role: "Team Lead — West Bengal",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Manish Singh",
    role: "Sales Manager — Andaman and Nicobar Islands",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Meera Jain",
    role: "Growth Manager — Chandigarh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Mohit Agarwal",
    role: "Business Development Manager — Dadra and Nagar Haveli and Daman and Diu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Neha Desai",
    role: "Marketing Manager — Delhi",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Nikhil Gupta",
    role: "Support Manager — Jammu and Kashmir",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Nisha Malhotra",
    role: "Product Manager — Ladakh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Pooja Chauhan",
    role: "Operations Lead — Lakshadweep",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Prakash Tiwari",
    role: "Sales Executive — Puducherry",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Priya Sharma",
    role: "Operations Manager — Andhra Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rahul Joshi",
    role: "Revenue Lead — Arunachal Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Raj Das",
    role: "CRM Administrator — Assam",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rakesh Pandey",
    role: "Business Owner — Bihar",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Riya Menon",
    role: "Founder — Chhattisgarh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rohan Patel",
    role: "Customer Success Lead — Goa",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sakshi Reddy",
    role: "Account Manager — Gujarat",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Sameer Bansal",
    role: "Team Lead — Haryana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sanjay Shah",
    role: "Sales Manager — Himachal Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Shreya Kumar",
    role: "Growth Manager — Jharkhand",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Simran Mishra",
    role: "Business Development Manager — Karnataka",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Sonal Saxena",
    role: "Marketing Manager — Kerala",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sourav Kulkarni",
    role: "Support Manager — Madhya Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Tanvi Verma",
    role: "Product Manager — Maharashtra",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Varun Kapoor",
    role: "Operations Lead — Manipur",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Vikas Roy",
    role: "Sales Executive — Meghalaya",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Vikram Yadav",
    role: "Operations Manager — Mizoram",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Yash Rao",
    role: "Revenue Lead — Nagaland",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aarav Mehta",
    role: "CRM Administrator — Odisha",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Aditi Nair",
    role: "Business Owner — Punjab",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aditya Sinha",
    role: "Founder — Rajasthan",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Akash Iyer",
    role: "Customer Success Lead — Sikkim",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aman Singh",
    role: "Account Manager — Tamil Nadu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Amit Jain",
    role: "Team Lead — Telangana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Ananya Agarwal",
    role: "Sales Manager — Tripura",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Arjun Desai",
    role: "Growth Manager — Uttar Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Bhavna Gupta",
    role: "Business Development Manager — Uttarakhand",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Chetan Malhotra",
    role: "Marketing Manager — West Bengal",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Deepak Chauhan",
    role: "Support Manager — Andaman and Nicobar Islands",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Diya Tiwari",
    role: "Product Manager — Chandigarh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Gaurav Sharma",
    role: "Operations Lead — Dadra and Nagar Haveli and Daman and Diu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Isha Joshi",
    role: "Sales Executive — Delhi",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Karan Das",
    role: "Operations Manager — Jammu and Kashmir",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Kavya Pandey",
    role: "Revenue Lead — Ladakh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Manish Menon",
    role: "CRM Administrator — Lakshadweep",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Meera Patel",
    role: "Business Owner — Puducherry",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Mohit Reddy",
    role: "Founder — Andhra Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Neha Bansal",
    role: "Customer Success Lead — Arunachal Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Nikhil Shah",
    role: "Account Manager — Assam",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Nisha Kumar",
    role: "Team Lead — Bihar",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Pooja Mishra",
    role: "Sales Manager — Chhattisgarh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Prakash Saxena",
    role: "Growth Manager — Goa",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Priya Kulkarni",
    role: "Business Development Manager — Gujarat",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Rahul Verma",
    role: "Marketing Manager — Haryana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Raj Kapoor",
    role: "Support Manager — Himachal Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rakesh Roy",
    role: "Product Manager — Jharkhand",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Riya Yadav",
    role: "Operations Lead — Karnataka",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rohan Rao",
    role: "Sales Executive — Kerala",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sakshi Mehta",
    role: "Operations Manager — Madhya Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Sameer Nair",
    role: "Revenue Lead — Maharashtra",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sanjay Sinha",
    role: "CRM Administrator — Manipur",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Shreya Iyer",
    role: "Business Owner — Meghalaya",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Simran Singh",
    role: "Founder — Mizoram",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Sonal Jain",
    role: "Customer Success Lead — Nagaland",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Sourav Agarwal",
    role: "Account Manager — Odisha",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Tanvi Desai",
    role: "Team Lead — Punjab",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Varun Gupta",
    role: "Sales Manager — Rajasthan",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Vikas Malhotra",
    role: "Growth Manager — Sikkim",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Vikram Chauhan",
    role: "Business Development Manager — Tamil Nadu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Yash Tiwari",
    role: "Marketing Manager — Telangana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Aarav Sharma",
    role: "Support Manager — Tripura",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Aditi Joshi",
    role: "Product Manager — Uttar Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aditya Das",
    role: "Operations Lead — Uttarakhand",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Akash Pandey",
    role: "Sales Executive — West Bengal",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aman Menon",
    role: "Operations Manager — Andaman and Nicobar Islands",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Amit Patel",
    role: "Revenue Lead — Chandigarh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Ananya Reddy",
    role: "CRM Administrator — Dadra and Nagar Haveli and Daman and Diu",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Arjun Bansal",
    role: "Business Owner — Delhi",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Bhavna Shah",
    role: "Founder — Jammu and Kashmir",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Chetan Kumar",
    role: "Customer Success Lead — Ladakh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Deepak Mishra",
    role: "Account Manager — Lakshadweep",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Diya Saxena",
    role: "Team Lead — Puducherry",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Gaurav Kulkarni",
    role: "Sales Manager — Andhra Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Isha Verma",
    role: "Growth Manager — Arunachal Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Karan Kapoor",
    role: "Business Development Manager — Assam",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Kavya Roy",
    role: "Marketing Manager — Bihar",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Manish Yadav",
    role: "Support Manager — Chhattisgarh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Meera Rao",
    role: "Product Manager — Goa",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Mohit Mehta",
    role: "Operations Lead — Gujarat",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Neha Nair",
    role: "Sales Executive — Haryana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Nikhil Sinha",
    role: "Operations Manager — Himachal Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Nisha Iyer",
    role: "Revenue Lead — Jharkhand",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Pooja Singh",
    role: "CRM Administrator — Karnataka",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Prakash Jain",
    role: "Business Owner — Kerala",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Priya Agarwal",
    role: "Founder — Madhya Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Rahul Desai",
    role: "Customer Success Lead — Maharashtra",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Raj Gupta",
    role: "Account Manager — Manipur",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rakesh Malhotra",
    role: "Team Lead — Meghalaya",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Riya Chauhan",
    role: "Sales Manager — Mizoram",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Rohan Tiwari",
    role: "Growth Manager — Nagaland",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Sakshi Sharma",
    role: "Business Development Manager — Odisha",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Sameer Joshi",
    role: "Marketing Manager — Punjab",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Sanjay Das",
    role: "Support Manager — Rajasthan",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Shreya Pandey",
    role: "Product Manager — Sikkim",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Simran Menon",
    role: "Operations Lead — Tamil Nadu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Sonal Patel",
    role: "Sales Executive — Telangana",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Sourav Reddy",
    role: "Operations Manager — Tripura",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Tanvi Bansal",
    role: "Revenue Lead — Uttar Pradesh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Varun Shah",
    role: "CRM Administrator — Uttarakhand",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Vikas Kumar",
    role: "Business Owner — West Bengal",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Vikram Mishra",
    role: "Founder — Andaman and Nicobar Islands",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Yash Saxena",
    role: "Customer Success Lead — Chandigarh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Aarav Kulkarni",
    role: "Account Manager — Dadra and Nagar Haveli and Daman and Diu",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Aditi Verma",
    role: "Team Lead — Delhi",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Aditya Kapoor",
    role: "Sales Manager — Jammu and Kashmir",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Akash Roy",
    role: "Growth Manager — Ladakh",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Aman Yadav",
    role: "Business Development Manager — Lakshadweep",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Amit Rao",
    role: "Marketing Manager — Puducherry",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Ananya Mehta",
    role: "Support Manager — Andhra Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Arjun Nair",
    role: "Product Manager — Arunachal Pradesh",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Bhavna Sinha",
    role: "Operations Lead — Assam",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Chetan Iyer",
    role: "Sales Executive — Bihar",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Deepak Singh",
    role: "Operations Manager — Chhattisgarh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Diya Jain",
    role: "Revenue Lead — Goa",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Gaurav Agarwal",
    role: "CRM Administrator — Gujarat",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Isha Desai",
    role: "Business Owner — Haryana",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Karan Gupta",
    role: "Founder — Himachal Pradesh",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Kavya Malhotra",
    role: "Customer Success Lead — Jharkhand",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Manish Chauhan",
    role: "Account Manager — Karnataka",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Meera Tiwari",
    role: "Team Lead — Kerala",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
  {
    name: "Mohit Sharma",
    role: "Sales Manager — Madhya Pradesh",
    text: "BR30 CRM gives our team a clearer view of customer activity and follow-ups.",
  },
  {
    name: "Neha Joshi",
    role: "Growth Manager — Maharashtra",
    text: "Keeping leads, contacts and daily activities together has made our workflow much simpler.",
  },
  {
    name: "Nikhil Das",
    role: "Business Development Manager — Manipur",
    text: "Our sales team spends less time searching for information and more time following up with customers.",
  },
  {
    name: "Nisha Pandey",
    role: "Marketing Manager — Meghalaya",
    text: "The pipeline view makes it easier to understand which opportunities need attention next.",
  },
  {
    name: "Pooja Menon",
    role: "Support Manager — Mizoram",
    text: "Having business activity in one workspace has helped our team stay organized as we grow.",
  },
  {
    name: "Prakash Patel",
    role: "Product Manager — Nagaland",
    text: "BR30 CRM makes routine customer management easier without adding unnecessary complexity.",
  },
  {
    name: "Priya Reddy",
    role: "Operations Lead — Odisha",
    text: "The unified workspace helps our team work from the same information and keep follow-ups consistent.",
  },
  {
    name: "Rahul Bansal",
    role: "Sales Executive — Punjab",
    text: "Managing sales activity is more structured now because our team can see the next action clearly.",
  },
];

function TestimonialsSection() {
  const viewportRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = viewportRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scrollReviews = (direction) => {
    const el = viewportRef.current;
    if (!el) return;

    const card = el.querySelector(".lp-testimonial");
    const gap = 14;
    const amount = card ? card.getBoundingClientRect().width + gap : 350;

    el.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });

    setTimeout(updateScrollButtons, 400);
  };

  const handleWheel = (event) => {
    const el = viewportRef.current;
    if (!el) return;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      el.scrollLeft += event.deltaY;
      updateScrollButtons();
    }
  };

  return (
    <>
      <style>{`.lp-testimonials{padding:100px 24px;background:var(--crm-bg)}.lp-testimonials-inner{max-width:1160px;margin:auto}.lp-testimonials-head{max-width:690px;margin:0 auto 42px;text-align:center}.lp-testimonials-head h2{margin:12px 0 14px;font-size:clamp(31px,4vw,46px);line-height:1.08;letter-spacing:-2px;color:var(--crm-text);font-weight:400}.lp-testimonials-head p{max-width:620px;margin:0 auto;color:var(--crm-muted);font-size:15px;line-height:1.75;font-weight:400}.lp-testimonials-toolbar{display:flex;align-items:center;justify-content:flex-end;margin-bottom:16px}.lp-testimonial-nav{display:flex;align-items:center;gap:7px}.lp-testimonial-nav-btn{width:36px;height:36px;border:1px solid var(--crm-border);border-radius:9px;background:var(--crm-surface);color:var(--crm-text);display:grid;place-items:center;cursor:pointer;transition:.2s}.lp-testimonial-nav-btn:hover:not(:disabled){background:var(--crm-primary);border-color:var(--crm-primary);color:#fff;transform:translateY(-1px)}.lp-testimonial-nav-btn:disabled{opacity:.35;cursor:not-allowed}.lp-testimonial-viewport{overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none;cursor:grab;overscroll-behavior-x:contain;touch-action:pan-x}.lp-testimonial-viewport::-webkit-scrollbar{display:none}.lp-testimonial-viewport:active{cursor:grabbing}.lp-testimonial-track{display:flex;gap:14px;width:max-content}.lp-testimonial{flex:0 0 calc((1160px - 28px) / 3);min-width:0;min-height:235px;padding:27px;border:1px solid var(--crm-border);border-radius:16px;background:var(--crm-surface-2);display:flex;flex-direction:column;transition:border-color .22s ease,box-shadow .22s ease,background .22s ease}.lp-testimonial:hover{border-color:color-mix(in srgb,var(--crm-primary) 30%,var(--crm-border));background:var(--crm-surface);box-shadow:var(--crm-shadow)}.lp-stars{display:flex;gap:3px;color:var(--crm-warning)}.lp-testimonial-quote{margin:20px 0;display:flex;flex-direction:column;gap:9px;font-size:13px;line-height:1.75;color:var(--crm-text);flex:1}.lp-quote-icon{color:var(--crm-primary);opacity:.8;flex:none}.lp-person{display:flex;align-items:center;gap:10px;padding-top:17px;border-top:1px solid var(--crm-border)}.lp-person-avatar{width:36px;height:36px;border-radius:10px;background:var(--crm-primary-soft);color:var(--crm-primary);display:grid;place-items:center;font-size:13px;font-weight:400;flex:none}.lp-person-name{font-size:13px;font-weight:400;color:var(--crm-text)}.lp-person-role{font-size:13px;color:var(--crm-muted);margin-top:2px}@media(max-width:1200px){.lp-testimonial{flex-basis:calc((100vw - 48px - 28px) / 3)}}@media(max-width:850px){.lp-testimonial{flex-basis:calc((100vw - 48px - 14px) / 2)}}@media(max-width:600px){.lp-testimonials{padding:75px 18px}.lp-testimonials-head{margin-bottom:32px}.lp-testimonials-head h2{font-size:32px;letter-spacing:-1.5px}.lp-testimonials-head p{font-size:14px}.lp-testimonial{flex-basis:calc(100vw - 36px);min-height:225px;padding:23px}.lp-testimonial-track{gap:12px}.lp-testimonial-nav-btn{width:34px;height:34px}}@media(max-width:420px){.lp-testimonial{flex-basis:calc(100vw - 32px)}}`}</style>

      <section className="lp-testimonials" id="testimonials">
        <div className="lp-testimonials-inner">
          <div className="lp-testimonials-head">
            <div className="lp-eyebrow">Customer stories</div>
            <h2>Built to make everyday work easier.</h2>
            <p>See how a connected CRM can help teams stay organized, follow opportunities and manage customer relationships.</p>
          </div>

          <div className="lp-testimonials-toolbar">
            <div className="lp-testimonial-nav">
              <button type="button" className="lp-testimonial-nav-btn" onClick={() => scrollReviews(-1)} disabled={!canScrollLeft} aria-label="Previous reviews">
                <ChevronLeft size={17} />
              </button>

              <button type="button" className="lp-testimonial-nav-btn" onClick={() => scrollReviews(1)} disabled={!canScrollRight} aria-label="Next reviews">
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          <div className="lp-testimonial-viewport" ref={viewportRef} onWheel={handleWheel} onScroll={updateScrollButtons}>
            <div className="lp-testimonial-track">
              {testimonials.map(({ name, role, text }) => (
                <article className="lp-testimonial" key={name}>
                  <div className="lp-stars">
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                  </div>

                  <div className="lp-testimonial-quote">
                    <Quote className="lp-quote-icon" size={17} />
                    <div>{text}</div>
                  </div>

                  <div className="lp-person">
                    <div className="lp-person-avatar">
                      {name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </div>

                    <div>
                      <div className="lp-person-name">{name}</div>
                      <div className="lp-person-role">{role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TestimonialsSection;
