import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const SAMPLE_DATA = {
  period: "Mar 21 – Mar 27, 2026",
  operations: {
    room_inspection: {
      period: "Mar 26 – Apr 2, 2026",
      trend: [
        { date: "Mar 26", completed: 9, success_rate: 90 },
        { date: "Mar 29", completed: 3, success_rate: 100 },
        { date: "Mar 30", completed: 3, success_rate: 85 },
        { date: "Mar 31", completed: 6, success_rate: 85 },
        { date: "Apr 1",  completed: 5, success_rate: 95 },
      ],
      failed_items: [
        { place: 1, item: "Tiles, grout, paint — no cracks, dirty or mildew", total: 9 },
        { place: 2, item: "Textile Sofa, Curtains and pillows clean?", total: 6 },
        { place: 3, item: "Walls, baseboards — no damages, fully painted", total: 3 },
        { place: 4, item: "Smell Neutral (not humid, mildew smell)", total: 3 },
        { place: 5, item: "Patio ceiling clean", total: 1 },
      ],
      failed_by_employee: [
        { place: 1, name: "Karminia Hernandez", total: 14 },
        { place: 2, name: "Mirian Chacon", total: 10 },
        { place: 3, name: "Lorenza Ceballos", total: 5 },
        { place: 4, name: "Rosley Primera", total: 3 },
        { place: 5, name: "Luz Duarte", total: 1 },
      ],
    },
    housekeeping_daily: [
      { name: "Public Area Checklist 11:00-20:00", expected: 7, completed: 6, compliance: 86, missed_details: [{ date: "Mar 21 (Sat)", by: "Not assigned" }] },
      { name: "Public Area Checklist 06:00-15:00", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "Daily Houseman Checklist", expected: 7, completed: 5, compliance: 71, missed_details: [{ date: "Mar 19 (Thu)", by: "Hoover Vinasco" }, { date: "Mar 22 (Sun)", by: "Roderick Zapiain" }] },
    ],
    housekeeping_weekly: [
      { name: "Monday HSK Cleaning Project", expected: 1, completed: 1, compliance: 100, missed_details: [] },
      { name: "Tuesday HSK Cleaning Project", expected: 1, completed: 0, compliance: 0, missed_details: [{ date: "Mar 25 (Tue)", by: "Not logged" }] },
      { name: "Thursday HSK Cleaning Project", expected: 1, completed: 1, compliance: 100, missed_details: [] },
      { name: "Friday HSK Cleaning Project", expected: 1, completed: 0, compliance: 0, missed_details: [{ date: "Mar 27 (Fri)", by: "Not logged" }] },
    ],
    fb: [
      { name: "Kitchen AM Checklist", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "Kitchen PM Checklist", expected: 7, completed: 6, compliance: 86, missed_details: [{ date: "Mar 26 (Sun)", by: "Kitchen Team" }] },
      { name: "Kitchen Management AM", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "Kitchen Management PM", expected: 7, completed: 5, compliance: 71, missed_details: [{ date: "Mar 23 (Thu)", by: "Kitchen Manager" }, { date: "Mar 25 (Sat)", by: "Kitchen Manager" }] },
      { name: "Restaurant Opening AM", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "Restaurant Opening PM", expected: 7, completed: 6, compliance: 86, missed_details: [{ date: "Mar 24 (Fri)", by: "F&B Team" }] },
      { name: "BAR Opening AM", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "BAR Closing Checklist", expected: 7, completed: 6, compliance: 86, missed_details: [{ date: "Mar 22 (Tue)", by: "Bar Team" }] },
      { name: "Beach F&B Opening", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "Beach F&B Closing", expected: 7, completed: 5, compliance: 71, missed_details: [{ date: "Mar 21 (Mon)", by: "Beach Team" }, { date: "Mar 26 (Sun)", by: "Beach Team" }] },
    ],
    frontdesk: [
      { name: "Front Office Daily Checklist Morning", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "Front Office Daily Checklist Afternoon", expected: 7, completed: 6, compliance: 86, missed_details: [{ date: "Mar 26 (Sun)", by: "Suzanne Hoek" }] },
      { name: "FD Supervisor - Manager Not On Property", expected: 7, completed: 5, compliance: 71, missed_details: [{ date: "Mar 22 (Tue)", by: "Arianne De Ruiter" }, { date: "Mar 25 (Sat)", by: "Genesis Ramirez" }] },
    ],
    maintenance_checklists: [
      { name: "Maintenance Lock Up", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "MT Supervisor Daily Maintenance", expected: 7, completed: 6, compliance: 86, missed_details: [{ date: "Mar 24 (Fri)", by: "Angel Rodriguez" }] },
      { name: "Daily Maintenance Supervisor", expected: 7, completed: 6, compliance: 86, missed_details: [{ date: "Mar 26 (Sun)", by: "Segundo Munoz" }] },
      { name: "Daily Pool Readings", expected: 7, completed: 7, compliance: 100, missed_details: [] },
      { name: "Daily RO Reading", expected: 7, completed: 5, compliance: 71, missed_details: [{ date: "Mar 24 (Fri)", by: "Sharlon Elizabeth" }, { date: "Mar 26 (Sun)", by: "Not logged" }] },
    ],
  },
  repairs: {
    total: 51, completed: 44, open: 7, completion_pct: 86, avg_resolution_hours: 14.2,
    by_category: [
      { type: "Paint",       total: 7,  completed: 5,  open: 2 },
      { type: "Batteries",   total: 7,  completed: 7,  open: 0 },
      { type: "Maintenance", total: 9,  completed: 8,  open: 1 },
      { type: "AC",          total: 3,  completed: 2,  open: 1 },
      { type: "Lighting",    total: 3,  completed: 3,  open: 0 },
      { type: "Door/Lock",   total: 3,  completed: 2,  open: 1 },
      { type: "Phone",       total: 2,  completed: 1,  open: 1 },
      { type: "Pool",        total: 2,  completed: 2,  open: 0 },
      { type: "Drain/Sewer", total: 1,  completed: 1,  open: 0 },
      { type: "Furniture",   total: 2,  completed: 2,  open: 0 },
      { type: "Hot Water",   total: 1,  completed: 1,  open: 0 },
      { type: "Other",       total: 11, completed: 10, open: 1 },
    ],
    trend: [
      { day: "Sat 21", created: 4,  completed: 4  },
      { day: "Sun 22", created: 7,  completed: 7  },
      { day: "Mon 23", created: 4,  completed: 5  },
      { day: "Tue 24", created: 11, completed: 9  },
      { day: "Wed 25", created: 16, completed: 14 },
      { day: "Thu 26", created: 6,  completed: 5  },
      { day: "Fri 27", created: 3,  completed: 0  },
    ],
  },
  staff_repair_time: [
    { name: "Adriana Mercado",     tickets: 8, total_hours: 14.2, avg_hours: 1.8, categories: "Paint, Maintenance" },
    { name: "Sharlon Elizabeth",   tickets: 6, total_hours: 12.1, avg_hours: 2.0, categories: "Lighting, Phone, Pool" },
    { name: "Randolf Britton",     tickets: 7, total_hours: 9.4,  avg_hours: 1.3, categories: "Maintenance, Door/Lock" },
    { name: "Nestor Infante",      tickets: 5, total_hours: 8.3,  avg_hours: 1.7, categories: "Drain/Sewer, Maintenance" },
    { name: "Angel Rodriguez",     tickets: 3, total_hours: 6.2,  avg_hours: 2.1, categories: "AC, Maintenance" },
    { name: "Wilson Jimenez",      tickets: 2, total_hours: 3.1,  avg_hours: 1.6, categories: "Paint" },
    { name: "Eleiddy Pena Kanaar", tickets: 7, total_hours: 5.8,  avg_hours: 0.8, categories: "Batteries, Maintenance" },
    { name: "Jonal Maintenance",   tickets: 2, total_hours: 2.4,  avg_hours: 1.2, categories: "Batteries" },
  ],
  ro_filter_readings: [
    { date: "Mar 30", submitted_by: "Angel Rodriguez", before_comd: 5054, after_comd: 4993, before_tds: 4252, after_tds: 3861, before_orp: 191, after_orp: 142, runtime: 19269 },
    { date: "Apr 01", submitted_by: "Angel Rodriguez", before_comd: 5448, after_comd: 5352, before_tds: 4246, after_tds: 4184, before_orp: 196, after_orp: 136, runtime: 19293 },
  ],
  guest: {
    total_feedback: 64, positive: 38, negative: 26, satisfaction_pct: 59,
    issues: [
      { category: "Coco Cafe Menu Options",       count: 4, severity: "Recurring", resolved: 4 },
      { category: "Beach and Beach Chairs",        count: 3, severity: "Recurring", resolved: 1 },
      { category: "Phone / Electrical Issue",      count: 3, severity: "Recurring", resolved: 1 },
      { category: "Noise Complaint",               count: 2, severity: "Moderate",  resolved: 2 },
      { category: "Grocery / Snacks",              count: 2, severity: "Moderate",  resolved: 0 },
      { category: "Staff / Service Level",         count: 2, severity: "Moderate",  resolved: 0 },
      { category: "Room Location / Value",         count: 2, severity: "Moderate",  resolved: 1 },
      { category: "Spa Experience",                count: 1, severity: "Isolated",  resolved: 1 },
      { category: "Transportation",                count: 1, severity: "Isolated",  resolved: 0 },
      { category: "Billing",                       count: 1, severity: "Isolated",  resolved: 0 },
      { category: "Housekeeping / Cleanliness",    count: 2, severity: "Moderate",  resolved: 1 },
      { category: "Opening Hours",                 count: 1, severity: "Isolated",  resolved: 0 },
      { category: "Guest App / Chair Reservation", count: 1, severity: "Isolated",  resolved: 0 },
    ],
    trend: [
      { day: "Sat 21", positive: 1,  negative: 4 },
      { day: "Sun 22", positive: 4,  negative: 1 },
      { day: "Mon 23", positive: 17, negative: 3 },
      { day: "Tue 24", positive: 3,  negative: 4 },
      { day: "Wed 25", positive: 9,  negative: 5 },
      { day: "Thu 26", positive: 4,  negative: 7 },
      { day: "Fri 27", positive: 0,  negative: 2 },
    ],
  },
  revinate: {
    likelihood_recommend: { jan: 98.36, feb: 98.42, mar: 97.55, apr: 96.67, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 98.07 },
    review_metrics:       { jan: 100.00, feb: 100.00, mar: 100.00, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 100.00 },
    overall_rating:       { jan: 100.00, feb: 100.00, mar: 100.00, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 100.00 },
    categories: [
      { label: "Overall Experience",       jan: 97.12, feb: 96.49, mar: 95.41, apr: 94.79, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 96.22 },
      { label: "Hotel Arrival Experience", jan: 97.60, feb: 98.16, mar: 95.66, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 97.12 },
      { label: "Your Casita",              jan: 97.60, feb: 95.70, mar: 96.94, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 96.72 },
      { label: "Cleanliness",              jan: 99.32, feb: 98.39, mar: 99.22, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 98.96 },
      { label: "Hotel Facilities",         jan: 98.29, feb: 98.39, mar: 97.87, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 98.19 },
      { label: "Beach Experience",         jan: 94.29, feb: 90.96, mar: 89.95, apr: 75.00,  may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 91.29 },
      { label: "Hotels Web App",           jan: 90.63, feb: 92.91, mar: 89.47, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 91.06 },
      { label: "Eco and Sustainability",   jan: 97.58, feb: 97.25, mar: 98.58, apr: 91.67,  may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 97.75 },
      { label: "Food and Beverage",        jan: 94.29, feb: 94.51, mar: 90.98, apr: 83.33,  may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 93.01 },
      { label: "Front Desk and Concierge", jan: 100.00, feb: 99.19, mar: 97.37, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 98.77 },
      { label: "Friendliness of Staff",    jan: 100.00, feb: 99.73, mar: 97.96, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 99.16 },
      { label: "Helpfulness of Staff",     jan: 99.66, feb: 98.37, mar: 97.68, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 98.49 },
      { label: "Spa",                      jan: 96.25, feb: 94.35, mar: 93.24, apr: 87.50,  may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 94.17 },
      { label: "About Us",                 jan: 93.75, feb: 78.57, mar: 75.00, apr: 100.00, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null, total: 81.25 },
    ],
    benchmark_2025: {
      likelihood_recommend: { jan: 97.29, feb: 97.27, mar: 97.88, apr: 98.94, may: 98.62, jun: 98.57, jul: 98.15, aug: 99.29, sep: 96.61, oct: 98.28, nov: 96.25, dec: 97.41, total: 97.89 },
      categories: [
        { label: "Overall Experience",       jan: 95.29, feb: 94.42, mar: 95.88, apr: 96.70, total: 96.23 },
        { label: "Hotel Arrival Experience", jan: 98.24, feb: 98.38, mar: 97.84, apr: 97.61, total: 97.94 },
        { label: "Your Casita",              jan: 95.88, feb: 96.43, mar: 98.32, apr: 95.21, total: 97.08 },
        { label: "Cleanliness",              jan: 97.94, feb: 96.71, mar: 98.32, apr: 99.73, total: 98.78 },
        { label: "Hotel Facilities",         jan: 96.73, feb: 96.67, mar: 97.28, apr: 97.31, total: 97.71 },
        { label: "Beach Experience",         jan: 92.17, feb: 90.33, mar: 92.07, apr: 92.39, total: 92.62 },
        { label: "Hotels Web App",           jan: 87.08, feb: 90.45, mar: 90.28, apr: 92.86, total: 90.76 },
        { label: "Eco and Sustainability",   jan: 95.45, feb: 98.46, mar: 98.31, apr: 99.09, total: 97.96 },
        { label: "Food and Beverage",        jan: 91.67, feb: 92.23, mar: 90.56, apr: 94.25, total: 93.00 },
        { label: "Front Desk and Concierge", jan: 97.06, feb: 95.95, mar: 97.55, apr: 98.92, total: 97.95 },
        { label: "Friendliness of Staff",    jan: 98.82, feb: 97.00, mar: 97.82, apr: 98.40, total: 98.28 },
        { label: "Helpfulness of Staff",     jan: 99.40, feb: 95.67, mar: 97.82, apr: 99.20, total: 98.30 },
        { label: "Spa",                      jan: 93.00, feb: 84.72, mar: 94.35, apr: 95.39, total: 94.32 },
        { label: "About Us",                 jan: 80.00, feb: 50.00, mar: 60.00, apr: 79.55, total: 76.29 },
      ],
    },
  },
  training: {
    overall_completion: 53, total_users: 72,
    employees_below_75: [
      { name: "Stephanie Rooijakkers", job: "Hotel Manager",          completion: 0,  days_inactive: 26  },
      { name: "Fernando Restrepo",     job: "Houseman",               completion: 0,  days_inactive: 81  },
      { name: "Hoover Vinasco",        job: "Houseman",               completion: 14, days_inactive: 130 },
      { name: "Trisha Reinkemeyer",    job: "Asst. Hotel Manager",    completion: 16, days_inactive: 0   },
      { name: "Randolf Britton",       job: "Maintenance Manager",    completion: 16, days_inactive: 1   },
      { name: "Mereline Geerman",      job: "Accountant",             completion: 22, days_inactive: 22  },
      { name: "Stephanie Hernandez",   job: "Front Desk",             completion: 27, days_inactive: 9   },
      { name: "Lorenza Ceballos",      job: "Housekeeper",            completion: 34, days_inactive: 8   },
      { name: "Ramsey Rasmijn",        job: "Financial Controller",   completion: 42, days_inactive: 9   },
      { name: "Julen Mejia",           job: "Bartender",              completion: 49, days_inactive: 14  },
      { name: "Valery Stamper",        job: "Front Office Manager",   completion: 49, days_inactive: 14  },
      { name: "Angel Rodriguez",       job: "Maintenance Supervisor", completion: 63, days_inactive: 23  },
      { name: "Arianne De Ruiter",     job: "Front Desk Supervisor",  completion: 66, days_inactive: 28  },
      { name: "Segundo Munoz Munoz",   job: "Maintenance Supervisor", completion: 71, days_inactive: 1   },
      { name: "Suzanne Hoek",          job: "Front Desk Agent",       completion: 74, days_inactive: 6   },
    ],
    inactive_14_days: 25,
    dept_scores: [
      { dept: "Sales and Marketing", avg: 7  },
      { dept: "Management",          avg: 37 },
      { dept: "Accounting",          avg: 40 },
      { dept: "Maintenance",         avg: 55 },
      { dept: "F&B",                 avg: 56 },
      { dept: "Front Desk",          avg: 57 },
      { dept: "Housekeeping",        avg: 63 },
    ],
    topics_below_75: [
      { topic: "Emergency SOPs",                    completion: 17, assigned: 70 },
      { topic: "Employees Etiquette",               completion: 20, assigned: 70 },
      { topic: "HR 01 - Attendance and Scheduling", completion: 21, assigned: 72 },
      { topic: "Emergency and Safety",              completion: 40, assigned: 70 },
      { topic: "Handbook",                          completion: 50, assigned: 72 },
      { topic: "Linen Logging in Flexkeeping",      completion: 36, assigned: 19 },
      { topic: "Preventive Maintenance",            completion: 38, assigned: 13 },
    ],
  },
  inventory: {
    users: [
      { name: "Randolf Britton",            moved: 69, qty_updated: 33, created: 144, deleted: 12, cloned: 2, total: 260 },
      { name: "Myriam Alvarado",            moved: 0,  qty_updated: 9,  created: 0,   deleted: 0,  cloned: 0, total: 9   },
      { name: "Marcela Velez",              moved: 0,  qty_updated: 5,  created: 0,   deleted: 0,  cloned: 0, total: 5   },
      { name: "Brooke Diaz",               moved: 0,  qty_updated: 3,  created: 0,   deleted: 0,  cloned: 0, total: 3   },
      { name: "Adrianna Mercado",          moved: 0,  qty_updated: 3,  created: 0,   deleted: 0,  cloned: 0, total: 3   },
      { name: "Joselyn Farro",             moved: 0,  qty_updated: 0,  created: 1,   deleted: 0,  cloned: 0, total: 1   },
      { name: "Shyron Serberie",           moved: 0,  qty_updated: 0,  created: 0,   deleted: 0,  cloned: 0, total: 0   },
      { name: "Mickael Mesker",            moved: 0,  qty_updated: 0,  created: 0,   deleted: 0,  cloned: 0, total: 0   },
      { name: "Junior Rodriquez",          moved: 0,  qty_updated: 0,  created: 0,   deleted: 0,  cloned: 0, total: 0   },
      { name: "Fleur Calame",              moved: 0,  qty_updated: 0,  created: 0,   deleted: 0,  cloned: 0, total: 0   },
      { name: "Arianne De Ruiter",         moved: 0,  qty_updated: 0,  created: 0,   deleted: 0,  cloned: 0, total: 0   },
    ],
    sales: {
      total: 162744.90, food_cogs: 31365.99, food_cogs_pct: 17.26,
      theo_food_cogs: 53677.68, theo_food_cogs_pct: 29.54,
      beverage_usage: 34737.84, central_stores: 30975.41,
      daily: [
        { date: "Mar 4",  sales: 6673 }, { date: "Mar 6",  sales: 6803 }, { date: "Mar 8",  sales: 6367 },
        { date: "Mar 10", sales: 7228 }, { date: "Mar 12", sales: 5453 }, { date: "Mar 14", sales: 6182 },
        { date: "Mar 16", sales: 5101 }, { date: "Mar 18", sales: 7050 }, { date: "Mar 20", sales: 7145 },
        { date: "Mar 22", sales: 6460 }, { date: "Mar 24", sales: 5105 }, { date: "Mar 26", sales: 5296 },
        { date: "Mar 28", sales: 5975 }, { date: "Mar 30", sales: 4013 },
      ],
    },
    waste: {
      total: 183.01,
      items: [
        { item: "Spinach",       category: "Produce", qty: "3360 GR", value: 84.97 },
        { item: "Asparagus",     category: "Produce", qty: "2000 GR", value: 45.82 },
        { item: "Kale",          category: "Produce", qty: "5 KG",    value: 25.00 },
        { item: "Bell Pepper",   category: "Produce", qty: "1.88 KG", value: 14.68 },
        { item: "Pineapple",     category: "Produce", qty: "1.08 EA", value: 8.62  },
        { item: "Eggs Fresh",    category: "Dairy",   qty: "4 EA",    value: 2.33  },
        { item: "Green Cabbage", category: "Produce", qty: "0.22 EA", value: 1.58  },
      ],
    },
    top10_variance: [
      { item: "Limes Fresh (Green)",   category: "Produce", actual_cost: 3282.20 },
      { item: "Kiwi Green Fresh",      category: "Produce", actual_cost: 1753.32 },
      { item: "Jose Cuervo Silver",    category: "Alcohol", actual_cost: 1543.62 },
      { item: "Chill Cans",            category: "Beer",    actual_cost: 1107.66 },
      { item: "Gerard Bertrand Rose",  category: "Alcohol", actual_cost: 1063.39 },
      { item: "Kendall Jackson Cab",   category: "Alcohol", actual_cost: 961.34  },
      { item: "Palmera Dark Rum",      category: "Alcohol", actual_cost: 902.55  },
      { item: "Ginger Beer",           category: "Non-Alc", actual_cost: 894.82  },
      { item: "Orange Fresh",          category: "Produce", actual_cost: 854.95  },
      { item: "Federico De Alvear",    category: "Alcohol", actual_cost: 817.73  },
    ],
  },
  sustainability: {
    electricity_coco: [
      { date: "Mar 21", reading: 78528, delta: null, status: "Baseline" },
      { date: "Mar 22", reading: 78576, delta: 48,   status: "Normal"   },
      { date: "Mar 23", reading: 78619, delta: 43,   status: "Normal"   },
      { date: "Mar 25", reading: 78714, delta: 95,   status: "Spike"    },
      { date: "Mar 26", reading: 78763, delta: 49,   status: "Normal"   },
    ],
    water_daily: [
      { date: "Mar 21", reading: 49185, delta: null, status: "Baseline" },
      { date: "Mar 22", reading: 49223, delta: 38,   status: "Normal"   },
      { date: "Mar 23", reading: 49254, delta: 31,   status: "Normal"   },
      { date: "Mar 25", reading: 49332, delta: 78,   status: "Spike"    },
      { date: "Mar 26", reading: 49925, delta: 593,  status: "Spike"    },
    ],
    ro_water: [
      { date: "Mar 21", reading: 19192, delta: null, status: "Baseline" },
      { date: "Mar 22", reading: 19194, delta: 2,    status: "Poor"     },
      { date: "Mar 23", reading: 19203, delta: 9,    status: "Poor"     },
      { date: "Mar 25", reading: 19226, delta: 23,   status: "Normal"   },
      { date: "Mar 26", reading: 19234, delta: 8,    status: "Poor"     },
    ],
    bubali: [
      { date: "Mar 21", reading: 11664, delta: null, status: "Baseline" },
      { date: "Mar 22", reading: 11672, delta: 8,    status: "Normal"   },
      { date: "Mar 23", reading: 11677, delta: 5,    status: "Normal"   },
      { date: "Mar 25", reading: 11688, delta: 11,   status: "Normal"   },
      { date: "Mar 26", reading: 11693, delta: 5,    status: "Normal"   },
    ],
    gas: [
      { date: "Mar 21", level: 80, delta: null },
      { date: "Mar 22", level: 75, delta: 5    },
      { date: "Mar 23", level: 70, delta: 5    },
      { date: "Mar 25", level: 65, delta: 5    },
      { date: "Mar 26", level: 59, delta: 6    },
    ],
  },
  linen: {
    staff_usage: [
      { name: "Mirian Chacon",      bath: 96,  pillowcase: 82,  fitted: 23, sheets: 46, face: 85,  washcloth: 74, bathmat: 38, total: 444, rooms: 44, per_room: 10.1 },
      { name: "Karminia Hernandez", bath: 100, pillowcase: 41,  fitted: 17, sheets: 24, face: 67,  washcloth: 79, bathmat: 49, total: 377, rooms: 38, per_room: 9.9  },
      { name: "Anoris Suarez",      bath: 80,  pillowcase: 58,  fitted: 18, sheets: 36, face: 44,  washcloth: 49, bathmat: 36, total: 321, rooms: 34, per_room: 9.4  },
      { name: "Rosley Primera",     bath: 52,  pillowcase: 44,  fitted: 12, sheets: 20, face: 37,  washcloth: 43, bathmat: 26, total: 236, rooms: 26, per_room: 9.1  },
      { name: "Yoeli Infante",      bath: 49,  pillowcase: 50,  fitted: 36, sheets: 29, face: 43,  washcloth: 0,  bathmat: 19, total: 226, rooms: 25, per_room: 9.0  },
      { name: "Lorenza Ceballos",   bath: 20,  pillowcase: 12,  fitted: 3,  sheets: 7,  face: 26,  washcloth: 20, bathmat: 8,  total: 96,  rooms: 12, per_room: 8.0  },
      { name: "Diana De La Cruz",   bath: 9,   pillowcase: 11,  fitted: 9,  sheets: 0,  face: 3,   washcloth: 5,  bathmat: 3,  total: 40,  rooms: 6,  per_room: 6.7  },
    ],
    totals: { bath: 406, pillowcase: 298, fitted: 118, sheets: 162, face: 305, washcloth: 270, bathmat: 179, total: 1740 },
    sectors: [
      { zone: "Zone 100", bath: 102, pillowcase: 80,  fitted: 31, sheets: 42, face: 86,  washcloth: 74,  bathmat: 48, total: 465 },
      { zone: "Zone 200", bath: 107, pillowcase: 58,  fitted: 20, sheets: 33, face: 81,  washcloth: 85,  bathmat: 51, total: 435 },
      { zone: "Zone 300", bath: 197, pillowcase: 160, fitted: 67, sheets: 87, face: 138, washcloth: 111, bathmat: 80, total: 840 },
    ],
    variance: [
      { item: "Bath Towels",   sent: 406, returned: 400, variance: -6, status: "Monitor" },
      { item: "Pillowcases",   sent: 298, returned: 298, variance: 0,  status: "OK"      },
      { item: "Fitted Sheets", sent: 118, returned: 116, variance: -2, status: "OK"      },
      { item: "Sheets",        sent: 162, returned: 159, variance: -3, status: "OK"      },
      { item: "Face Towels",   sent: 305, returned: 301, variance: -4, status: "Monitor" },
      { item: "Washcloths",    sent: 270, returned: 268, variance: -2, status: "OK"      },
      { item: "Bath Mats",     sent: 179, returned: 177, variance: -2, status: "OK"      },
    ],
  },
  weekly_trend: [
    { week: "Jan W3", ops: 79, repairs: 75, guest: 69, training: 77 },
    { week: "Jan W4", ops: 88, repairs: 80, guest: 72, training: 82 },
    { week: "Feb W1", ops: 84, repairs: 74, guest: 68, training: 79 },
    { week: "Feb W2", ops: 86, repairs: 73, guest: 65, training: 81 },
    { week: "Feb W3", ops: 83, repairs: 78, guest: 67, training: 81 },
    { week: "Feb W4", ops: 85, repairs: 76, guest: 66, training: 80 },
    { week: "Mar W1", ops: 84, repairs: 77, guest: 63, training: 80 },
    { week: "Mar W2", ops: 87, repairs: 86, guest: 59, training: 80 },
  ],
};

// ── REVIEWS DATA ──────────────────────────────────────────────────────────────
const REVIEWS = {
  google: {
    hotel: {
      rating: 4.9, total: 324, ranking: null,
      breakdown: { 5: 89, 4: 8, 3: 2, 2: 1, 1: 0 },
      reviews: [
        { author: "Sarah M.",  date: "Mar 28", rating: 5, text: "Absolutely magical stay. The casitas are stunning and staff went above and beyond.", avatar: "SM" },
        { author: "James T.",  date: "Mar 25", rating: 5, text: "Best hotel in Aruba. Intimate, peaceful. We will be back every year.", avatar: "JT" },
        { author: "Priya K.",  date: "Mar 22", rating: 4, text: "Lovely boutique experience. Minor issue with beach chairs in the afternoon.", avatar: "PK" },
        { author: "David L.",  date: "Mar 19", rating: 5, text: "Staff remembered our names from day one. Coco Cafe breakfast is incredible.", avatar: "DL" },
        { author: "Emma R.",   date: "Mar 15", rating: 5, text: "Boardwalk stands out for the personal touch. The team is exceptional.", avatar: "ER" },
      ],
    },
    restaurant: {
      rating: 4.7, total: 187, ranking: null,
      breakdown: { 5: 72, 4: 20, 3: 5, 2: 2, 1: 1 },
      reviews: [
        { author: "Linda H.", date: "Mar 27", rating: 5, text: "Acai bowl and fresh juices are a highlight every morning.", avatar: "LH" },
        { author: "Marco B.", date: "Mar 24", rating: 4, text: "Great breakfast spot. Everything was fresh and delicious.", avatar: "MB" },
        { author: "Anika S.", date: "Mar 20", rating: 5, text: "Sat on the water for breakfast. The avocado toast is a must.", avatar: "AS" },
        { author: "Tom W.",   date: "Mar 17", rating: 3, text: "Nice atmosphere but service was slow during the morning rush.", avatar: "TW" },
        { author: "Carla N.", date: "Mar 14", rating: 5, text: "Came back three mornings in a row! The barista knows her craft.", avatar: "CN" },
      ],
    },
  },
  tripadvisor: {
    hotel: {
      rating: 4.9, total: 892, ranking: "#3 of 52 hotels in Aruba",
      breakdown: { 5: 88, 4: 9, 3: 2, 2: 1, 1: 0 },
      reviews: [
        { author: "TravelCouple_NY", date: "Mar 29", rating: 5, text: "Nothing comes close to the personal touch of Boardwalk.", avatar: "TC" },
        { author: "BeachLover_EU",   date: "Mar 26", rating: 5, text: "Staff treats you like family from arrival to departure.", avatar: "BL" },
        { author: "WanderlustMom",   date: "Mar 23", rating: 4, text: "Wonderful for couples. Loved the intimacy of the smaller scale.", avatar: "WM" },
        { author: "LuxTraveler88",   date: "Mar 20", rating: 5, text: "4th stay. The team upgrades us every time. Pure class.", avatar: "LT" },
        { author: "SunSeeker_CA",    date: "Mar 16", rating: 5, text: "Woke up to waves every morning. You feel like you own the place.", avatar: "SS" },
      ],
    },
    restaurant: {
      rating: 4.5, total: 431, ranking: "#12 of 198 restaurants in Aruba",
      breakdown: { 5: 58, 4: 28, 3: 10, 2: 3, 1: 1 },
      reviews: [
        { author: "FoodieAruba",    date: "Mar 28", rating: 5, text: "Best breakfast on the island. Order the tropical bowl.", avatar: "FA" },
        { author: "EspressoAddict", date: "Mar 25", rating: 4, text: "Solid coffee. Wish they had more lunch options.", avatar: "EA" },
        { author: "IslandHopper",   date: "Mar 21", rating: 5, text: "Smoothies are outstanding. Perfect start to every morning.", avatar: "IH" },
        { author: "QuietTraveler",  date: "Mar 18", rating: 4, text: "Peaceful, charming, high food quality.", avatar: "QT" },
        { author: "CaribbeanCruiser", date: "Mar 13", rating: 5, text: "Best acai bowl in the Caribbean.", avatar: "CC" },
      ],
    },
  },
  opentable: {
    hotel: null,
    restaurant: {
      rating: 4.8, total: 213, ranking: null,
      scores: { food: 4.8, service: 4.9, ambience: 4.9, value: 4.6 },
      breakdown: { 5: 76, 4: 17, 3: 5, 2: 1, 1: 1 },
      reviews: [
        { author: "OpenTable Diner", date: "Mar 30", rating: 5, text: "Made a reservation for our anniversary — the team surprised us!", avatar: "OD" },
        { author: "Verified Diner",  date: "Mar 27", rating: 5, text: "Eggs benedict with local catch is phenomenal.", avatar: "VD" },
        { author: "Breakfast Club",  date: "Mar 24", rating: 4, text: "Lovely spot. OpenTable reservation was seamless.", avatar: "BC" },
        { author: "Aruba Regular",   date: "Mar 21", rating: 5, text: "Come here every visit. Always fresh, always friendly.", avatar: "AR" },
        { author: "Foodie Traveler", date: "Mar 17", rating: 5, text: "Granola parfait and cold brew is unmatched.", avatar: "FT" },
      ],
    },
  },
};

const PLATFORM_CFG = {
  google:      { color: "#4285f4", label: "Google"      },
  tripadvisor: { color: "#00aa6c", label: "TripAdvisor" },
  opentable:   { color: "#da3743", label: "OpenTable"   },
};
const AVCOLS = ["#0ea5e9","#8b5cf6","#f59e0b","#10b981","#ef4444","#ec4899"];

const getStatus = (pct) => pct >= 95 ? "green" : pct >= 85 ? "yellow" : "red";
const STATUS_COLORS = { green: "#22c55e", yellow: "#f59e0b", red: "#ef4444" };
const CHART_COLORS = ["#0ea5e9","#22c55e","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];

const Badge = ({ status }) => {
  const map = {
    green: { bg: "#dcfce7", text: "#15803d", label: "Green" },
    yellow: { bg: "#fef9c3", text: "#a16207", label: "Yellow" },
    red: { bg: "#fee2e2", text: "#b91c1c", label: "Red" },
    Recurring: { bg: "#fee2e2", text: "#b91c1c", label: "Recurring" },
    Moderate: { bg: "#fef9c3", text: "#a16207", label: "Moderate" },
    Isolated: { bg: "#dbeafe", text: "#1d4ed8", label: "Isolated" },
    Active: { bg: "#dcfce7", text: "#15803d", label: "Active" },
    OK: { bg: "#dcfce7", text: "#15803d", label: "OK" },
    Monitor: { bg: "#fef9c3", text: "#a16207", label: "Monitor" },
    Spike: { bg: "#fee2e2", text: "#b91c1c", label: "Spike" },
    Normal: { bg: "#dcfce7", text: "#15803d", label: "Normal" },
    Poor: { bg: "#fee2e2", text: "#b91c1c", label: "Poor" },
    Baseline: { bg: "#f3f4f6", text: "#374151", label: "Baseline" },
    Resolved: { bg: "#dcfce7", text: "#15803d", label: "Resolved" },
    "In Progress": { bg: "#dbeafe", text: "#1e40af", label: "In Prog" },
    Pending: { bg: "#fee2e2", text: "#b91c1c", label: "Pending" },
  };
  const s = map[status] || { bg: "#f3f4f6", text: "#6b7280", label: status };
  return <span style={{ background: s.bg, color: s.text, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.label}</span>;
};

const KPICard = ({ title, value, subtitle, color, icon, flag }) => (
  <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: flag ? "0 0 0 2px #ef4444, 0 4px 16px rgba(0,0,0,0.07)" : "0 4px 16px rgba(0,0,0,0.07)", borderLeft: `5px solid ${color}`, position: "relative" }}>
    {flag && <div style={{ position: "absolute", top: 10, right: 14, fontSize: 16 }}>🚩</div>}
    <div style={{ fontSize: 22, marginBottom: 2 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginTop: 4 }}>{title}</div>
    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{subtitle}</div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 16, borderBottom: "2px solid #e2e8f0", paddingBottom: 10 }}>
    <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0 }}>{title}</h2>
    {subtitle && <p style={{ color: "#64748b", fontSize: 12, margin: "3px 0 0" }}>{subtitle}</p>}
  </div>
);

// ── REVIEWS COMPONENTS ────────────────────────────────────────────────────────
function RatingCard({ data, platform, venue }) {
  const cfg = PLATFORM_CFG[platform];
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: `2px solid ${cfg.color}25`, flex: 1, minWidth: 155 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: 1 }}>{cfg.label}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginTop: 2 }}>{venue === "hotel" ? "🏨 Hotel" : "☕ Coco Cafe"}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1e293b" }}>{data.rating.toFixed(1)}</div>
          <div style={{ fontSize: 10, color: "#64748b" }}>{data.total.toLocaleString()} reviews</div>
          {data.ranking && <div style={{ fontSize: 9, color: cfg.color, fontWeight: 700, marginTop: 2 }}>{data.ranking}</div>}
          {data.scores && <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>Food {data.scores.food} · Svc {data.scores.service} · Amb {data.scores.ambience}</div>}
        </div>
        <div style={{ fontSize: 20, color: "#f59e0b" }}>{"★".repeat(Math.round(data.rating))}</div>
      </div>
      <div style={{ marginTop: 8 }}>
        {[5,4,3,2,1].map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
            <span style={{ fontSize: 9, color: "#94a3b8", width: 8 }}>{s}</span>
            <div style={{ flex: 1, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${data.breakdown[s]}%`, height: "100%", background: cfg.color }} />
            </div>
            <span style={{ fontSize: 9, color: "#94a3b8", width: 22 }}>{data.breakdown[s]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewList({ reviews, platform }) {
  const cfg = PLATFORM_CFG[platform];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {reviews.map((r, i) => (
        <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${cfg.color}` }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: AVCOLS[i % 6], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{r.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{r.author}</span>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{r.date}</span>
              </div>
              <div style={{ fontSize: 12, color: "#f59e0b", margin: "2px 0" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{r.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function OverviewTab({ data }) {
  const allOps = [...data.operations.housekeeping_daily, ...data.operations.housekeeping_weekly, ...data.operations.fb, ...data.operations.frontdesk, ...data.operations.maintenance_checklists];
  const ops_avg = Math.round(allOps.reduce((a, b) => a + b.compliance, 0) / allOps.length);
  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 24 }}>
        <SectionHeader title="8-Week Performance Trend" subtitle="Weekly KPI scores" />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.weekly_trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="ops"      stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} name="Operations %"        />
            <Line type="monotone" dataKey="repairs"  stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Repair Completion %"  />
            <Line type="monotone" dataKey="guest"    stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} name="Guest Satisfaction %"  />
            <Line type="monotone" dataKey="training" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} name="Training %"            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KPICard title="Ops Compliance"     value={`${ops_avg}%`}                          subtitle="All checklist avg"              color={STATUS_COLORS[getStatus(ops_avg)]}                                                          icon="📋" flag={ops_avg < 85} />
        <KPICard title="Repair Completion"  value={`${data.repairs.completion_pct}%`}       subtitle={`${data.repairs.open} open`}    color={STATUS_COLORS[getStatus(data.repairs.completion_pct)]}                                      icon="🔧" />
        <KPICard title="Guest Satisfaction" value={`${data.guest.satisfaction_pct}%`}       subtitle={`${data.guest.negative} issues`} color={data.guest.satisfaction_pct >= 70 ? "#22c55e" : data.guest.satisfaction_pct >= 60 ? "#f59e0b" : "#ef4444"} icon="⭐" flag={data.guest.satisfaction_pct < 65} />
        <KPICard title="Training"           value={`${data.training.overall_completion}%`}  subtitle={`${data.training.employees_below_75.length} below 75%`} color={STATUS_COLORS[getStatus(data.training.overall_completion)]} icon="🎓" flag={data.training.overall_completion < 75} />
        <KPICard title="Avg Resolution"     value={`${data.repairs.avg_resolution_hours}h`} subtitle="Per repair ticket"              color="#8b5cf6" icon="⏱" />
        <KPICard title="Total Linen"        value={data.linen.totals.total.toLocaleString()} subtitle="Pieces this week"              color="#14b8a6" icon="🛏" />
        <KPICard title="Open Tickets"       value={data.repairs.open}                        subtitle="Requires action"               color={data.repairs.open > 10 ? "#ef4444" : "#f59e0b"} icon="🚨" flag={data.repairs.open > 10} />
        <KPICard title="Inactive Staff 14d" value={data.training.inactive_14_days}           subtitle="Training platform"             color="#ef4444" icon="👤" flag={true} />
      </div>
      <div style={{ background: "#0f172a", borderRadius: 14, padding: 24, color: "#fff" }}>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>GM Executive Summary — Week of Mar 21–27, 2026</div>
        {[
          { icon: "🔴", label: "GUEST SATISFACTION RISK",   text: "Satisfaction at 59% — lowest in 8 weeks. Beach chairs & Coco Cafe menu top recurring complaints." },
          { icon: "🟡", label: "MAINTENANCE IMPROVED",       text: "Repair completion up to 86% (from 78%). 7 open tickets: Paint (2), AC (1), Door/Lock (1), Phone (1)." },
          { icon: "🔴", label: "WATER SPIKE — Mar 26",       text: "Daily water meter +593 m3 on Mar 26 (vs normal ~35 m3/day). Urgent investigation required." },
          { icon: "🟡", label: "RO WATER CONCERN",           text: "RO production below 10 m3/day on Mar 22, 23 & 26. System inconsistent." },
          { icon: "🟡", label: "GAS DECLINING",              text: "Gas tank dropped 80% to 59% over 6 days. Refill needed within ~10 days." },
          { icon: "🟡", label: "TRAINING UNCHANGED",         text: `${data.training.employees_below_75.length} staff below 75%. ${data.training.inactive_14_days} employees inactive 14+ days.` },
          { icon: "🔴", label: "ROOM INSPECTION FAILURES",   text: "Karminia Hernandez (14) & Mirian Chacon (10) = 73% of all failed inspections. Top issue: tiles/grout/paint (9x)." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, padding: "10px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 10 }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <div><span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>{item.label}: </span><span style={{ color: "#e2e8f0", fontSize: 12 }}>{item.text}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── OPERATIONS ────────────────────────────────────────────────────────────────
function OperationsTab({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const handleEnter = (e, row) => {
    if (!row.missed_details?.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top, row });
  };
  const renderTable = (rows) => (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead><tr style={{ background: "#f8fafc" }}>
        {["Checklist","Exp","Done","Compliance","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: h === "Checklist" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}
      </tr></thead>
      <tbody>{rows.map((row, i) => {
        const st = getStatus(row.compliance);
        const hasMissed = row.compliance < 95 && row.missed_details?.length > 0;
        return (
          <tr key={i} style={{ background: row.compliance === 0 ? "#fff0f0" : "#fff", borderBottom: "1px solid #f1f5f9" }}>
            <td style={{ padding: "8px 10px" }}>{row.name}</td>
            <td style={{ padding: "8px 10px", textAlign: "center", color: "#94a3b8" }}>{row.expected}</td>
            <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 600 }}>{row.completed}</td>
            <td style={{ padding: "8px 10px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <div style={{ width: 50, height: 5, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${row.compliance}%`, height: "100%", background: STATUS_COLORS[st], borderRadius: 3 }} />
                </div>
                <span style={{ fontWeight: 700, color: STATUS_COLORS[st] }}>{row.compliance}%</span>
              </div>
            </td>
            <td style={{ padding: "8px 10px", textAlign: "center" }}>
              <span onMouseEnter={hasMissed ? e => handleEnter(e, row) : undefined} onMouseLeave={() => setTooltip(null)} style={{ cursor: hasMissed ? "help" : "default" }}>
                <Badge status={st} />{hasMissed && <span style={{ marginLeft: 3, fontSize: 10, color: "#94a3b8" }}>i</span>}
              </span>
            </td>
          </tr>
        );
      })}</tbody>
    </table>
  );
  const allRows = [...data.operations.housekeeping_daily, ...data.operations.housekeeping_weekly, ...data.operations.fb, ...data.operations.frontdesk, ...data.operations.maintenance_checklists];
  const chartData = [
    { name: ">=95% Green",  value: allRows.filter(r => r.compliance >= 95).length,                       color: "#22c55e" },
    { name: "85-94% Yellow",value: allRows.filter(r => r.compliance >= 85 && r.compliance < 95).length,  color: "#f59e0b" },
    { name: "<85% Red",     value: allRows.filter(r => r.compliance > 0 && r.compliance < 85).length,    color: "#ef4444" },
    { name: "0% Critical",  value: allRows.filter(r => r.compliance === 0).length,                       color: "#b91c1c" },
  ];
  return (
    <div>
      {tooltip && (
        <div style={{ position: "fixed", left: tooltip.x, top: tooltip.y - 8, transform: "translate(-50%, -100%)", background: "#1e293b", color: "#fff", padding: "10px 14px", borderRadius: 10, fontSize: 12, zIndex: 9999, pointerEvents: "none", minWidth: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#f59e0b", fontSize: 11, textTransform: "uppercase" }}>Missed Occurrences</div>
          {tooltip.row.missed_details.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "3px 0", borderBottom: i < tooltip.row.missed_details.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <span style={{ color: "#94a3b8" }}>{m.date}</span>
              <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{m.by}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Compliance Distribution" subtitle={`${allRows.length} total checklists`} />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" radius={[4,4,0,0]}>{chartData.map((e,i) => <Cell key={i} fill={e.color} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Status Summary" />
          {chartData.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < chartData.length - 1 ? "1px solid #f1f5f9" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 9, height: 9, borderRadius: "50%", background: d.color }} /><span style={{ fontSize: 12, color: "#475569" }}>{d.name}</span></div>
              <span style={{ fontWeight: 800, fontSize: 18, color: d.color }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
      {[
        { title: "Housekeeping — Daily",  rows: data.operations.housekeeping_daily },
        { title: "Housekeeping — Weekly", rows: data.operations.housekeeping_weekly },
        { title: "F&B Checklists",        rows: data.operations.fb },
        { title: "Front Desk",            rows: data.operations.frontdesk },
        { title: "Maintenance",           rows: data.operations.maintenance_checklists },
      ].map((s, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
          <SectionHeader title={s.title} />{renderTable(s.rows)}
        </div>
      ))}
    </div>
  );
}

// ── MAINTENANCE ───────────────────────────────────────────────────────────────
function MaintenanceTab({ data }) {
  const r = data.repairs;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KPICard title="Total Tickets"  value={r.total}                        subtitle="This week"           color="#0ea5e9" icon="🎫" />
        <KPICard title="Completed"      value={r.completed}                    subtitle={`${r.completion_pct}% rate`} color="#22c55e" icon="✅" />
        <KPICard title="Open Tickets"   value={r.open}                         subtitle="Requires action"     color={r.open > 10 ? "#ef4444" : "#f59e0b"} icon="🔓" flag={r.open > 10} />
        <KPICard title="Avg Resolution" value={`${r.avg_resolution_hours}h`}   subtitle="Per ticket"          color="#8b5cf6" icon="⏱" />
      </div>

      {/* Daily Ticket Flow + Issues by Category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Daily Ticket Flow" subtitle="Created vs Completed" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={r.trend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend /><Bar dataKey="created" fill="#0ea5e9" name="Created" radius={[4,4,0,0]} /><Bar dataKey="completed" fill="#22c55e" name="Completed" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Issues by Category" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={r.by_category} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={80} /><Tooltip /><Bar dataKey="completed" fill="#22c55e" name="Completed" stackId="a" /><Bar dataKey="open" fill="#ef4444" name="Open" stackId="a" radius={[0,4,4,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Repair Breakdown Table */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 20 }}>
        <SectionHeader title="Issue Breakdown by Category" subtitle="51 total · 44 completed · 7 open" />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["Issue Type","Total","Completed","Open","Completion %"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: h === "Issue Type" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
          <tbody>{r.by_category.map((row, i) => {
            const pct = Math.round((row.completed / row.total) * 100);
            return (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: row.open > 0 ? "#fffbf0" : "#fff" }}>
                <td style={{ padding: "8px 12px", fontWeight: 600 }}>{row.type}</td>
                <td style={{ padding: "8px 12px", textAlign: "center", color: "#64748b" }}>{row.total}</td>
                <td style={{ padding: "8px 12px", textAlign: "center", color: "#22c55e", fontWeight: 700 }}>{row.completed}</td>
                <td style={{ padding: "8px 12px", textAlign: "center", color: row.open > 0 ? "#ef4444" : "#64748b", fontWeight: row.open > 0 ? 700 : 400 }}>{row.open}</td>
                <td style={{ padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <div style={{ width: 50, height: 5, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: STATUS_COLORS[getStatus(pct)], borderRadius: 3 }} />
                    </div>
                    <span style={{ color: STATUS_COLORS[getStatus(pct)], fontWeight: 700 }}>{pct}%</span>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, fontSize: 11, color: "#9a3412" }}>
          Open items: Paint (2) · AC (1) · Door/Lock (1) · Phone (1) · Maintenance (1) · Other (1)
        </div>
      </div>

      {/* Staff Time */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 20 }}>
        <SectionHeader title="Total Time per Staff Member" subtitle="Mar 21–28 · Threshold: 30h minimum" />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>
            {["Staff Member","Tickets","Total Hours","Avg/Ticket","Categories"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: h === "Staff Member" || h === "Categories" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}
          </tr></thead>
          <tbody>{data.staff_repair_time.sort((a, b) => b.total_hours - a.total_hours).map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ padding: "8px 12px", fontWeight: 600 }}>{row.name}</td>
              <td style={{ padding: "8px 12px", textAlign: "center", color: "#0ea5e9", fontWeight: 700 }}>{row.tickets}</td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <div style={{ width: 60, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((row.total_hours / 40) * 100, 100)}%`, height: "100%", background: row.total_hours >= 30 ? "#22c55e" : "#ef4444", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontWeight: 700, color: row.total_hours >= 30 ? "#22c55e" : "#ef4444" }}>{row.total_hours}h</span>
                </div>
              </td>
              <td style={{ padding: "8px 12px", textAlign: "center", color: "#64748b" }}>{row.avg_hours}h</td>
              <td style={{ padding: "8px 12px", color: "#64748b", fontSize: 11 }}>{row.categories}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* RO Filter Readings */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
        <SectionHeader title="RO Filter Readings" subtitle="Before vs After — Angel Rodriguez" />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>
            {["Date","By","COMD Bef","COMD Aft","TDS Bef","TDS Aft","ORP Bef","ORP Aft","Runtime"].map(h => <th key={h} style={{ padding: "7px 9px", textAlign: "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569", fontSize: 11 }}>{h}</th>)}
          </tr></thead>
          <tbody>{data.ro_filter_readings.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "7px 9px", textAlign: "center", fontWeight: 600 }}>{row.date}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#64748b", fontSize: 11 }}>{row.submitted_by}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#ef4444", fontWeight: 700 }}>{row.before_comd}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#22c55e", fontWeight: 700 }}>{row.after_comd}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#ef4444", fontWeight: 700 }}>{row.before_tds}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#22c55e", fontWeight: 700 }}>{row.after_tds}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#ef4444", fontWeight: 700 }}>{row.before_orp}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#22c55e", fontWeight: 700 }}>{row.after_orp}</td>
              <td style={{ padding: "7px 9px", textAlign: "center", color: "#22c55e", fontWeight: 700 }}>{row.runtime.toLocaleString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── GUEST ─────────────────────────────────────────────────────────────────────
function GuestTab({ data }) {
  const g = data.guest;
  const rev = data.revinate;
  const [venue, setVenue] = useState("hotel");
  const [reviewPlatform, setReviewPlatform] = useState("google");
  const pieData = [{ name: "Positive", value: g.positive, color: "#22c55e" }, { name: "Negative", value: g.negative, color: "#ef4444" }];

  const handleVenue = (v) => {
    setVenue(v);
    if (v === "hotel" && reviewPlatform === "opentable") setReviewPlatform("google");
  };

  const fmt = v => v != null ? v.toFixed(2) : "-";
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const b25 = rev.benchmark_2025 || {};

  function scoreColor(v26, v25) {
    if (v26 == null) return "#94a3b8";
    if (v25 == null) return v26 >= 97 ? "#22c55e" : v26 >= 93 ? "#f59e0b" : "#ef4444";
    return v26 > v25 ? "#22c55e" : v26 < v25 ? "#ef4444" : "#f59e0b";
  }
  function scoreBg(v26, v25) {
    if (v26 == null) return "#fff";
    if (v25 == null) return v26 >= 97 ? "#f0fdf4" : v26 >= 93 ? "#fffbeb" : "#fff7f7";
    return v26 > v25 ? "#f0fdf4" : v26 < v25 ? "#fff7f7" : "#fffbeb";
  }
  function arrow(v26, v25) {
    if (v26 == null || v25 == null) return "";
    const d = (v26 - v25).toFixed(2);
    return v26 > v25 ? ` +${d}` : v26 < v25 ? ` ${d}` : " =";
  }

  const availablePlatforms = venue === "hotel" ? ["google","tripadvisor"] : ["google","tripadvisor","opentable"];

  return (
    <div>
      {/* Revinate */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 24 }}>
        <SectionHeader title="Revinate Post-Stay Scores" subtitle="Jan–Dec 2026 vs 2025 — Green = above / Red = below last year" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#fff", fontWeight: 700, minWidth: 160 }}>Category</th>
                {monthLabels.map(h => <th key={h} style={{ padding: "8px 5px", textAlign: "center", color: "#94a3b8", fontWeight: 700, fontSize: 10 }}>{h}</th>)}
                <th style={{ padding: "8px", textAlign: "center", color: "#f59e0b", fontWeight: 700, fontSize: 10 }}>2026</th>
                <th style={{ padding: "8px", textAlign: "center", color: "#64748b", fontWeight: 700, fontSize: 10 }}>2025</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <td style={{ padding: "8px 12px", fontWeight: 700 }}>Likelihood to Recommend</td>
                {months.map(m => {
                  const v26 = rev.likelihood_recommend[m]; const v25 = b25.likelihood_recommend?.[m];
                  return <td key={m} style={{ padding: "5px", textAlign: "center", fontWeight: 700, color: scoreColor(v26,v25), background: scoreBg(v26,v25), fontSize: 10 }}>{v26 != null ? `${fmt(v26)}${arrow(v26,v25)}` : "-"}</td>;
                })}
                <td style={{ padding: "5px 8px", textAlign: "center", fontWeight: 700, color: scoreColor(rev.likelihood_recommend.total, b25.likelihood_recommend?.total), background: scoreBg(rev.likelihood_recommend.total, b25.likelihood_recommend?.total) }}>{fmt(rev.likelihood_recommend.total)}</td>
                <td style={{ padding: "5px 8px", textAlign: "center", color: "#64748b" }}>{fmt(b25.likelihood_recommend?.total)}</td>
              </tr>
              <tr style={{ background: "#dbeafe" }}><td colSpan={15} style={{ padding: "3px 12px", fontSize: 10, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase" }}>Satisfaction Categories</td></tr>
              {rev.categories.map((cat, i) => {
                const b25cat = b25.categories?.find(c => c.label === cat.label);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "7px 12px", color: "#1e293b" }}>{cat.label}</td>
                    {months.map(m => {
                      const v26 = cat[m]; const v25 = b25cat?.[m];
                      return <td key={m} style={{ padding: "5px", textAlign: "center", fontWeight: 700, color: scoreColor(v26,v25), background: scoreBg(v26,v25), fontSize: 10 }}>{v26 != null ? `${fmt(v26)}${arrow(v26,v25)}` : "-"}</td>;
                    })}
                    <td style={{ padding: "5px 8px", textAlign: "center", fontWeight: 700, color: scoreColor(cat.total, b25cat?.total), background: scoreBg(cat.total, b25cat?.total) }}>{fmt(cat.total)}</td>
                    <td style={{ padding: "5px 8px", textAlign: "center", color: "#64748b" }}>{fmt(b25cat?.total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VFC Feedback */}
      <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>📋</span>
        <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>FLEXKEEPING VFC — In-Stay Feedback — Mar 21–28, 2026 · 64 total · 38 positive · 26 negative</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Daily Feedback Trend" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={g.trend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend /><Area type="monotone" dataKey="positive" stroke="#22c55e" fill="#dcfce7" strokeWidth={2} name="Positive" /><Area type="monotone" dataKey="negative" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} name="Negative" /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Ratio" />
          <ResponsiveContainer width="100%" height={190}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issue Log */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 20 }}>
        <SectionHeader title="Issue Log" subtitle="Negative feedback categorized — Mar 21–28" />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["Category","Count","Pattern","Resolved","Status"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: h === "Category" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
          <tbody>{g.issues.sort((a,b) => b.count - a.count).map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: row.severity === "Recurring" ? "#fff7f7" : "#fff" }}>
              <td style={{ padding: "8px 12px", fontWeight: 600 }}>{row.category}</td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: row.count >= 3 ? "#ef4444" : "#1e293b" }}>{row.count}</td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}><Badge status={row.severity} /></td>
              <td style={{ padding: "8px 12px", textAlign: "center", color: "#64748b" }}>{row.resolved}/{row.count}</td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}><Badge status={row.resolved === row.count ? "Resolved" : row.severity === "Recurring" ? "In Progress" : "Pending"} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Online Reviews */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
        <SectionHeader title="Online Reviews" subtitle="Google · TripAdvisor · OpenTable — Boardwalk Hotel & Coco Cafe" />
        {/* Venue toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["hotel","restaurant"].map(v => (
            <button key={v} onClick={() => handleVenue(v)} style={{ padding: "6px 18px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, borderRadius: 8, background: venue === v ? "#0f172a" : "#f1f5f9", color: venue === v ? "#fff" : "#64748b" }}>
              {v === "hotel" ? "🏨 Hotel" : "☕ Coco Cafe"}
            </button>
          ))}
        </div>
        {/* Rating summary cards */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {availablePlatforms.map(p => {
            const d = REVIEWS[p][venue];
            if (!d) return null;
            return <RatingCard key={p} data={d} platform={p} venue={venue} />;
          })}
        </div>
        {/* Platform tab selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {availablePlatforms.map(p => {
            const cfg = PLATFORM_CFG[p];
            return (
              <button key={p} onClick={() => setReviewPlatform(p)} style={{ padding: "6px 14px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, borderRadius: 8, background: reviewPlatform === p ? cfg.color : "#f1f5f9", color: reviewPlatform === p ? "#fff" : "#64748b" }}>
                {cfg.label}
              </button>
            );
          })}
        </div>
        {/* Review list */}
        {REVIEWS[reviewPlatform]?.[venue] && (
          <ReviewList reviews={REVIEWS[reviewPlatform][venue].reviews} platform={reviewPlatform} />
        )}
      </div>
    </div>
  );
}

// ── TRAINING ──────────────────────────────────────────────────────────────────
function TrainingTab({ data }) {
  const t = data.training;
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? t.employees_below_75 : t.employees_below_75.slice(0, 10);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KPICard title="Overall Completion" value={`${t.overall_completion}%`} subtitle={`${t.total_users} total staff`}                   color={STATUS_COLORS[getStatus(t.overall_completion)]} icon="🎓" flag={t.overall_completion < 75} />
        <KPICard title="Below 75%"          value={t.employees_below_75.length} subtitle="Need intervention"                               color="#ef4444" icon="👥" flag={true} />
        <KPICard title="Critical (0-24%)"   value={t.employees_below_75.filter(e => e.completion < 25).length} subtitle="Immediate action"  color="#ef4444" icon="🚨" flag={true} />
        <KPICard title="Inactive 14+ Days"  value={t.inactive_14_days}           subtitle="No platform activity"                            color="#ef4444" icon="💤" flag={true} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Completion by Department" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={t.dept_scores} layout="vertical" margin={{ right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" domain={[0,100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={v => [`${v}%`, "Avg"]} />
              <Bar dataKey="avg" radius={[0,4,4,0]}>{t.dept_scores.map((e,i) => <Cell key={i} fill={e.avg >= 75 ? "#22c55e" : e.avg >= 50 ? "#f59e0b" : "#ef4444"} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Key Topics Below 75%" />
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {t.topics_below_75.sort((a,b) => a.completion - b.completion).map((row,i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ flex: 1, fontSize: 11, color: "#1e293b" }}>{row.topic}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{row.assigned}</div>
                <div style={{ width: 40, fontWeight: 700, fontSize: 12, color: row.completion < 25 ? "#ef4444" : "#f59e0b", textAlign: "right" }}>{row.completion}%</div>
                <div style={{ width: 40, height: 5, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${row.completion}%`, height: "100%", background: row.completion < 25 ? "#ef4444" : "#f59e0b" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
        <SectionHeader title={`Staff Below 75% (${t.employees_below_75.length} of ${t.total_users})`} subtitle="Red rows = 14+ days inactive" />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["Name","Job Title","Completion","Progress","Days Inactive","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: h === "Name" || h === "Job Title" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
          <tbody>{displayed.map((row,i) => {
            const inactive = row.days_inactive >= 14;
            const critical = row.completion < 25;
            return (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: critical && inactive ? "#fff0f0" : critical ? "#fff7f7" : inactive ? "#fffbf0" : "#fff" }}>
                <td style={{ padding: "7px 10px", fontWeight: 600 }}>{row.name}</td>
                <td style={{ padding: "7px 10px", color: "#64748b" }}>{row.job}</td>
                <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 800, color: row.completion < 25 ? "#ef4444" : row.completion < 50 ? "#f97316" : "#f59e0b" }}>{row.completion}%</td>
                <td style={{ padding: "7px 10px", textAlign: "center" }}>
                  <div style={{ width: 70, height: 5, background: "#e2e8f0", borderRadius: 3, overflow: "hidden", margin: "0 auto" }}>
                    <div style={{ width: `${row.completion}%`, height: "100%", background: row.completion < 25 ? "#ef4444" : "#f59e0b" }} />
                  </div>
                </td>
                <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: inactive ? 700 : 400, color: row.days_inactive > 60 ? "#ef4444" : inactive ? "#f59e0b" : "#64748b" }}>{row.days_inactive}d</td>
                <td style={{ padding: "7px 10px", textAlign: "center" }}><Badge status={critical || inactive ? "red" : "yellow"} /></td>
              </tr>
            );
          })}</tbody>
        </table>
        {t.employees_below_75.length > 10 && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={() => setShowAll(!showAll)} style={{ padding: "7px 20px", background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#475569" }}>
              {showAll ? "Show Less" : `Show All ${t.employees_below_75.length} Staff`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
function InventoryTab({ data }) {
  const inv = data.inventory;
  const s = inv.sales;
  const CAT_COLORS = { Produce: "#10b981", Alcohol: "#8b5cf6", Beer: "#f59e0b", "Non-Alc": "#0ea5e9", Other: "#94a3b8" };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KPICard title="Food Sales"  value={`Afl ${(s.total/1000).toFixed(1)}k`}          subtitle="Mar 4–30"                               color="#0ea5e9" icon="💰" />
        <KPICard title="Food COGS"   value={`${s.food_cogs_pct}%`}                         subtitle={`Afl ${s.food_cogs.toLocaleString()}`}   color="#22c55e" icon="🍽" />
        <KPICard title="Theo. COGS"  value={`${s.theo_food_cogs_pct}%`}                    subtitle={`Afl ${s.theo_food_cogs.toLocaleString()}`} color="#f59e0b" icon="📊" />
        <KPICard title="Bev. Usage"  value={`Afl ${(s.beverage_usage/1000).toFixed(1)}k`} subtitle="No sales baseline"                       color="#8b5cf6" icon="🍹" flag={true} />
        <KPICard title="Total Waste" value={`Afl ${inv.waste.total}`}                      subtitle={`${inv.waste.items.length} items`}       color="#ef4444" icon="🗑" />
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <SectionHeader title="Daily Food Sales — Mar 4–30" subtitle="Coco Cafe · LightSpeed POS · Total Afl 162,744.90" />
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={s.daily}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="date" tick={{ fontSize: 9 }} interval={2} /><YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} /><Tooltip formatter={v => [`Afl ${v.toLocaleString()}`, "Sales"]} /><Area type="monotone" dataKey="sales" stroke="#0ea5e9" fill="#dbeafe" strokeWidth={2} /></AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <SectionHeader title="Actual vs Theoretical COGS" subtitle="Actual 17.26% vs theoretical 29.54% — Afl 22,311 saved" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
          <div>
            {[
              { label: "Food — Actual",      value: `Afl ${s.food_cogs.toLocaleString()}`,          pct: `${s.food_cogs_pct}%`,      color: "#0ea5e9" },
              { label: "Food — Theoretical", value: `Afl ${s.theo_food_cogs.toLocaleString()}`,     pct: `${s.theo_food_cogs_pct}%`, color: "#f59e0b" },
              { label: "Variance (saved)",   value: `Afl ${(s.theo_food_cogs - s.food_cogs).toLocaleString()}`, pct: "+12.28%",    color: "#22c55e" },
              { label: "Beverage Usage",     value: `Afl ${s.beverage_usage.toLocaleString()}`,     pct: "No baseline",              color: "#ef4444" },
              { label: "Central Stores",     value: `Afl ${s.central_stores.toLocaleString()}`,     pct: "No baseline",              color: "#ef4444" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 11, color: "#475569" }}>{row.label}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: row.color }}>{row.value}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{row.pct}</div>
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={[{ name: "Food COGS", actual: s.food_cogs, theoretical: s.theo_food_cogs }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `Afl ${v.toLocaleString()}`} /><Legend />
              <Bar dataKey="actual" name="Actual COGS" fill="#0ea5e9" radius={[4,4,0,0]} />
              <Bar dataKey="theoretical" name="Theoretical COGS" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <SectionHeader title="Top 10 Items by Actual Cost" subtitle="No theoretical recipe baseline set" />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["#","Item","Category","Actual Cost"].map(h => <th key={h} style={{ padding: "6px 10px", textAlign: h === "Item" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
          <tbody>{inv.top10_variance.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i < 3 ? "#fff7f7" : "#fff" }}>
              <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700, color: i < 3 ? "#ef4444" : i < 6 ? "#f59e0b" : "#64748b" }}>{i+1}</td>
              <td style={{ padding: "6px 10px", fontWeight: 600 }}>{row.item}</td>
              <td style={{ padding: "6px 10px", textAlign: "center" }}>
                <span style={{ background: `${CAT_COLORS[row.category] || "#94a3b8"}20`, color: CAT_COLORS[row.category] || "#64748b", padding: "1px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700 }}>{row.category}</span>
              </td>
              <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>Afl {row.actual_cost.toFixed(0)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <SectionHeader title="Waste Report" subtitle={`Total: Afl ${inv.waste.total}`} />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["Item","Category","Qty","Value"].map(h => <th key={h} style={{ padding: "5px 8px", textAlign: h === "Item" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
          <tbody>{inv.waste.items.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "5px 8px", fontWeight: 600 }}>{row.item}</td>
              <td style={{ padding: "5px 8px", textAlign: "center", color: "#64748b" }}>{row.category}</td>
              <td style={{ padding: "5px 8px", textAlign: "center", color: "#64748b" }}>{row.qty}</td>
              <td style={{ padding: "5px 8px", textAlign: "center", fontWeight: 700, color: row.value > 50 ? "#ef4444" : "#f59e0b" }}>Afl {row.value.toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
        <SectionHeader title="Sortly User Activity" subtitle="Feb 27 – Mar 30, 2026" />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["User","Moved","Qty Updated","Created","Deleted","Cloned","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: h === "User" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
          <tbody>{inv.users.sort((a,b) => b.total - a.total).map((u, i) => {
            const active = u.total > 0;
            return (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: !active ? "#fff7f7" : "#fff" }}>
                <td style={{ padding: "7px 10px", fontWeight: active ? 600 : 400, color: active ? "#1e293b" : "#94a3b8" }}>{u.name}</td>
                {[u.moved, u.qty_updated, u.created, u.deleted, u.cloned].map((v, j) => (
                  <td key={j} style={{ padding: "7px 10px", textAlign: "center", color: v > 0 ? "#1e293b" : "#cbd5e1", fontWeight: v > 0 ? 600 : 400 }}>{v}</td>
                ))}
                <td style={{ padding: "7px 10px", textAlign: "center" }}>
                  {active ? <Badge status="Active" /> : <span style={{ fontSize: 11, color: "#94a3b8" }}>Inactive</span>}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 8, fontSize: 11, color: "#92400e" }}>
          Only <strong>Randolf Britton</strong> is actively managing Sortly. 10 of 11 users had zero activity this period.
        </div>
      </div>
    </div>
  );
}

// ── SUSTAINABILITY ────────────────────────────────────────────────────────────
function SustainabilityTab({ data }) {
  const s = data.sustainability;
  const renderSection = (title, rows, unit, roMode = false) => {
    const chartRows = rows.filter(r => r.delta != null);
    const getColor = (entry) => roMode ? (entry.delta >= 10 ? "#22c55e" : "#ef4444") : (entry.status === "Spike" ? "#ef4444" : "#0ea5e9");
    return (
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <SectionHeader title={title} subtitle={roMode ? "Daily production — >=10 m3 Good / below 10 Poor" : `Daily delta (${unit}) — spikes in red`} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartRows}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} width={50} /><Tooltip /><Bar dataKey="delta" radius={[4,4,0,0]}>{chartRows.map((e,i) => <Cell key={i} fill={getColor(e)} />)}</Bar></BarChart>
          </ResponsiveContainer>
          <table style={{ borderCollapse: "collapse", fontSize: 11, alignSelf: "start" }}>
            <thead><tr style={{ background: "#f8fafc" }}>{["Date","Reading",`Delta (${unit})`,"Status"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: h === "Date" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((row,i) => {
              const displayStatus = roMode && row.status !== "Baseline" ? (row.delta == null ? "-" : row.delta >= 10 ? "Normal" : "Poor") : row.status;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: row.status === "Spike" || (roMode && row.delta != null && row.delta < 10 && row.status !== "Baseline") ? "#fff7f7" : "#fff" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{row.date}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#64748b" }}>{row.reading != null ? row.reading.toLocaleString() : "-"}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 700, color: row.status === "Spike" ? "#ef4444" : roMode && row.delta != null ? (row.delta >= 10 ? "#22c55e" : "#ef4444") : row.delta == null ? "#94a3b8" : "#0ea5e9" }}>{row.delta == null ? "-" : `+${row.delta}`}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}><Badge status={displayStatus} /></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 10 }}>
        <span style={{ fontSize: 18 }}>🚨</span>
        <div><strong style={{ color: "#856404" }}>Critical Water Spike — Mar 26:</strong><span style={{ color: "#664d03", fontSize: 12, marginLeft: 8 }}>+593 m3 (normal ~35 m3/day). Possible leak. Investigate immediately.</span></div>
      </div>
      {renderSection("Electricity Meter (kWh)", s.electricity_coco, "kWh")}
      {renderSection("Daily Water Meter (m3)", s.water_daily, "m3")}
      {renderSection("RO Water Production (m3)", s.ro_water, "m3", true)}
      {renderSection("Bubali Water — Primary Supply (m3)", s.bubali, "m3", true)}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
        <SectionHeader title="Gas Tank Level" subtitle="Mar 21–26 · ~5%/day · refill recommended ~Apr 5–7" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={s.gas}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="date" tick={{ fontSize: 10 }} /><YAxis domain={[0,100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} /><Tooltip formatter={v => [`${v}%`, "Tank Level"]} /><Line type="monotone" dataKey="level" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: "#f97316" }} name="Tank %" /></LineChart>
          </ResponsiveContainer>
          <table style={{ borderCollapse: "collapse", fontSize: 11, alignSelf: "start" }}>
            <thead><tr style={{ background: "#f8fafc" }}>{["Date","Level","Delta"].map(h => <th key={h} style={{ padding: "6px 10px", textAlign: h === "Date" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
            <tbody>{s.gas.map((row,i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "6px 10px", fontWeight: 600 }}>{row.date}</td>
                <td style={{ padding: "6px 10px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <div style={{ width: 40, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${row.level}%`, height: "100%", background: row.level < 20 ? "#ef4444" : row.level < 40 ? "#f59e0b" : "#22c55e" }} />
                    </div>
                    <span style={{ fontWeight: 700, color: row.level < 20 ? "#ef4444" : row.level < 40 ? "#f59e0b" : "#22c55e" }}>{row.level}%</span>
                  </div>
                </td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#f97316", fontWeight: 700 }}>{row.delta ? `-${row.delta}%` : "-"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, fontSize: 12, color: "#9a3412" }}>
          Tank at 59% as of Mar 26. At ~5%/day — refill recommended within 10 days.
        </div>
      </div>
    </div>
  );
}

// ── HOUSEKEEPING (Room Inspection + Linen Control) ────────────────────────────
function HousekeepingTab({ data }) {
  const l = data.linen;
  const ri = data.operations.room_inspection;
  const activeStaff = l.staff_usage.filter(s => s.rooms > 0);
  const hotelAvg = (l.totals.total / activeStaff.reduce((a,b) => a + b.rooms, 0)).toFixed(1);
  return (
    <div>
      {/* Room Inspection */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 20, border: "2px solid #0ea5e920" }}>
        <SectionHeader title="Supervisor Room Inspection" subtitle={`Flexkeeping Checklist Dashboard · ${ri.period}`} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Completed Checklists & Success Rate</div>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={ri.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 9 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0,100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                <Tooltip />
                <Area yAxisId="left"  type="monotone" dataKey="completed"    stroke="#0ea5e9" fill="#dbeafe"  strokeWidth={2} name="Completed"  />
                <Area yAxisId="right" type="monotone" dataKey="success_rate" stroke="#22c55e" fill="#dcfce7"  strokeWidth={2} name="Success %"   fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Failed Responses per Employee</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ background: "#fef2f2" }}>{["#","Employee","Fails"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: h === "Employee" ? "left" : "center", borderBottom: "1px solid #fecaca", fontWeight: 700, color: "#ef4444" }}>{h}</th>)}</tr></thead>
              <tbody>{ri.failed_by_employee.map((e, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i === 0 ? "#fff7f7" : "#fff" }}>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>
                    <span style={{ background: i < 2 ? "#ef4444" : i < 4 ? "#f59e0b" : "#94a3b8", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{e.place}</span>
                  </td>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{e.name}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 800, color: i === 0 ? "#ef4444" : i < 3 ? "#f59e0b" : "#64748b" }}>{e.total}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Most Common Failed Responses</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["#","Failed Item","Total"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: h === "Failed Item" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
          <tbody>{ri.failed_items.map((item, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: item.total >= 6 ? "#fff7f7" : "#fff" }}>
              <td style={{ padding: "6px 8px", textAlign: "center" }}>
                <span style={{ background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#94a3b8", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{item.place}</span>
              </td>
              <td style={{ padding: "6px 8px", fontWeight: 600 }}>{item.item}</td>
              <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 800, color: item.total >= 6 ? "#ef4444" : item.total >= 3 ? "#f59e0b" : "#64748b" }}>{item.total}</td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{ marginTop: 10, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#92400e" }}>
          Karminia Hernandez (14 fails) and Mirian Chacon (10 fails) account for 73% of all failed inspections. Top failure: tiles/grout/paint (9x). Coaching and re-inspection recommended.
        </div>
      </div>

      {/* Linen Control Header */}
      <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>🛏</span>
        <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>Linen Control — Mar 21–27, 2026</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KPICard title="Total Linen Used" value={l.totals.total.toLocaleString()} subtitle="All items"       color="#0ea5e9" icon="🛏" />
        <KPICard title="Bath Towels"      value={l.totals.bath}                   subtitle="Tier 1 item"     color="#14b8a6" icon="🏨" />
        <KPICard title="Hotel Avg/Room"   value={hotelAvg}                        subtitle="Pieces per room" color="#8b5cf6" icon="📊" />
        <KPICard title="Highest User"     value="Mirian C."                       subtitle="444 pcs (26%)"   color="#f59e0b" icon="⚠️" flag={true} />
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <SectionHeader title="Delivery Summary by Item" />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[{item:"Bath Towels",qty:l.totals.bath},{item:"Pillowcases",qty:l.totals.pillowcase},{item:"Sheets",qty:l.totals.sheets},{item:"Fitted",qty:l.totals.fitted},{item:"Face Towels",qty:l.totals.face},{item:"Washcloths",qty:l.totals.washcloth},{item:"Bath Mats",qty:l.totals.bathmat}]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="item" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="qty" fill="#14b8a6" radius={[4,4,0,0]} name="Pieces" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Variance: Sent vs Returned" />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ background: "#f8fafc" }}>{["Item","Sent","Returned","Variance","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: h === "Item" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
            <tbody>{l.variance.map((row,i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: row.status !== "OK" ? "#fffbf0" : "#fff" }}>
                <td style={{ padding: "7px 10px", fontWeight: 600 }}>{row.item}</td>
                <td style={{ padding: "7px 10px", textAlign: "center" }}>{row.sent}</td>
                <td style={{ padding: "7px 10px", textAlign: "center" }}>{row.returned}</td>
                <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 700, color: row.variance < 0 ? "#f59e0b" : "#22c55e" }}>{row.variance}</td>
                <td style={{ padding: "7px 10px", textAlign: "center" }}><Badge status={row.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <SectionHeader title="Usage per Housekeeper" subtitle={`Hotel avg: ${hotelAvg} pcs/room`} />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ background: "#f8fafc" }}>{["Name","Total","Rooms","Per Room","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: h === "Name" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>{h}</th>)}</tr></thead>
            <tbody>{activeStaff.map((row,i) => {
              const flag = row.per_room > parseFloat(hotelAvg) * 1.2;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: flag ? "#fff7f7" : "#fff" }}>
                  <td style={{ padding: "7px 10px", fontWeight: 600 }}>{row.name}</td>
                  <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 700 }}>{row.total}</td>
                  <td style={{ padding: "7px 10px", textAlign: "center", color: "#64748b" }}>{row.rooms}</td>
                  <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 700, color: flag ? "#ef4444" : "#22c55e" }}>{row.per_room}</td>
                  <td style={{ padding: "7px 10px", textAlign: "center" }}><Badge status={flag ? "yellow" : "green"} /></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <SectionHeader title="Usage by Zone" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={l.sectors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="zone" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Bar dataKey="total" name="Total Pieces" radius={[4,4,0,0]}>{l.sectors.map((e,i) => <Cell key={i} fill={["#0ea5e9","#22c55e","#8b5cf6"][i]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <table style={{ borderCollapse: "collapse", fontSize: 12, alignSelf: "start" }}>
            <thead><tr style={{ background: "#f8fafc" }}>{["Zone","Bath","Pillow","Fitted","Sheets","Face","Wash","Mat","Total"].map(h => <th key={h} style={{ padding: "6px 7px", textAlign: h === "Zone" ? "left" : "center", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#475569", fontSize: 11 }}>{h}</th>)}</tr></thead>
            <tbody>{l.sectors.map((row,i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "6px 7px", fontWeight: 700, color: ["#0ea5e9","#22c55e","#8b5cf6"][i] }}>{row.zone}</td>
                {[row.bath, row.pillowcase, row.fitted, row.sheets, row.face, row.washcloth, row.bathmat].map((v,j) => <td key={j} style={{ padding: "6px 7px", textAlign: "center", color: "#475569" }}>{v}</td>)}
                <td style={{ padding: "6px 7px", textAlign: "center", fontWeight: 800 }}>{row.total}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <div style={{ background: "#0f172a", borderRadius: 14, padding: 20, color: "#fff" }}>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Linen Executive Summary</div>
        {[
          { icon: "🔴", text: "Mirian Chacon accounts for 26% of total linen (444 pieces, 10.1/room). Recommend room-by-room verification." },
          { icon: "🟡", text: "Bath towels show -6 piece variance — Monitor range. Face towels at -4. All other items within OK threshold." },
          { icon: "🟢", text: "Total linen slightly down vs prior week (1,740 vs 1,766). Zone 300 accounts for 48% of all linen distributed." },
          { icon: "🟡", text: "Diana De La Cruz logged only 40 pieces across 6 rooms — below hotel average. Verify room assignment accuracy." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "9px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 8 }}>
            <span>{item.icon}</span><span style={{ color: "#e2e8f0", fontSize: 12 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN SHELL ────────────────────────────────────────────────────────────────
export default function BoardwalkDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("week");
  const tabs = [
    { id: "overview",       label: "Overview",         icon: "🏨" },
    { id: "operations",     label: "Operations",       icon: "📋" },
    { id: "maintenance",    label: "Maintenance",      icon: "🔧" },
    { id: "guest",          label: "Guest Experience", icon: "⭐" },
    { id: "training",       label: "Training",         icon: "🎓" },
    { id: "inventory",      label: "Inventory",        icon: "📦" },
    { id: "sustainability", label: "Sustainability",   icon: "🌱" },
    { id: "housekeeping",   label: "Housekeeping",     icon: "🛏" },
  ];
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ background: "#0f172a", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #0ea5e9, #22c55e)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏨</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1 }}>Boardwalk Boutique Hotel</div>
              <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>Performance Intelligence Dashboard v1.1</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "#94a3b8", fontSize: 11, background: "#1e293b", padding: "5px 12px", borderRadius: 8 }}>{SAMPLE_DATA.period}</div>
            <div style={{ display: "flex", background: "#1e293b", borderRadius: 8, overflow: "hidden" }}>
              {["Day","Week","Month","Quarter","Year"].map(opt => (
                <button key={opt} onClick={() => setDateRange(opt.toLowerCase())} style={{ padding: "5px 10px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: dateRange === opt.toLowerCase() ? "#0ea5e9" : "transparent", color: dateRange === opt.toLowerCase() ? "#fff" : "#64748b" }}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 1, borderTop: "1px solid #1e293b", overflowX: "auto" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: "transparent", color: activeTab === tab.id ? "#0ea5e9" : "#64748b", borderBottom: activeTab === tab.id ? "2px solid #0ea5e9" : "2px solid transparent", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: "#dbeafe", borderBottom: "1px solid #bfdbfe", padding: "6px 24px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13 }}>🔗</span>
        <span style={{ fontSize: 11, color: "#1d4ed8" }}>
          <strong>Data Sources:</strong> Flexkeeping · Trainual · Sortly · Revinate · Google · TripAdvisor · OpenTable · LightSpeed POS
        </span>
      </div>
      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
        {activeTab === "overview"       && <OverviewTab       data={SAMPLE_DATA} />}
        {activeTab === "operations"     && <OperationsTab     data={SAMPLE_DATA} />}
        {activeTab === "maintenance"    && <MaintenanceTab    data={SAMPLE_DATA} />}
        {activeTab === "guest"          && <GuestTab          data={SAMPLE_DATA} />}
        {activeTab === "training"       && <TrainingTab       data={SAMPLE_DATA} />}
        {activeTab === "inventory"      && <InventoryTab      data={SAMPLE_DATA} />}
        {activeTab === "sustainability" && <SustainabilityTab data={SAMPLE_DATA} />}
        {activeTab === "housekeeping"   && <HousekeepingTab   data={SAMPLE_DATA} />}
      </div>
      <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: 11 }}>
        Boardwalk Boutique Hotel · Performance Intelligence Dashboard v1.1 · Flexkeeping · Trainual · Sortly · Revinate · Google · TripAdvisor · OpenTable
      </div>
    </div>
  );
}
