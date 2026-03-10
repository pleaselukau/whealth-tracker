import { useMemo, useState } from "react";

import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { HeroBanner } from "../components/HeroBanner";
import { SectionHeader } from "../components/SectionHeader";

type CategoryGroup = {
  key: string;
  title: string;
  items: string[];
};

const categoryGroups: CategoryGroup[] = [
  {
    key: "mood",
    title: "Mood",
    items: ["Calm", "Happy", "Energetic", "Mood swings", "Sad", "Anxious", "Low energy"],
  },
  {
    key: "symptoms",
    title: "Symptoms",
    items: ["Cramps", "Headache", "Tender breasts", "Fatigue", "Backache", "Acne", "Cravings"],
  },
  {
    key: "discharge",
    title: "Vaginal discharge",
    items: ["No discharge", "Creamy", "Watery", "Sticky", "Egg white", "Spotting", "Unusual"],
  },
  {
    key: "digestion",
    title: "Digestion and stool",
    items: ["Nausea", "Bloating", "Constipation", "Diarrhea"],
  },
  {
    key: "sex_drive",
    title: "Sex and sex drive",
    items: [
      "Didn’t have sex",
      "Protected sex",
      "Unprotected sex",
      "Oral sex",
      "Masturbation",
      "Orgasm",
      "High sex drive",
      "Low sex drive",
    ],
  },
  {
    key: "contraception",
    title: "Contraception / pills",
    items: ["Pill taken on time", "Missed pill", "Other pill", "Plan B"],
  },
  {
    key: "tests",
    title: "Pregnancy / ovulation tests",
    items: ["Didn’t take test", "Positive", "Negative", "Faint line", "Ovulation test"],
  },
  {
    key: "other",
    title: "Other",
    items: ["Travel", "Stress", "Meditation", "Journaling", "Alcohol", "Disease or injury"],
  },
];

type SelectedItem = {
  groupKey: string;
  groupTitle: string;
  label: string;
};

export function LogPage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  });
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");

  function toggleItem(groupKey: string, groupTitle: string, label: string) {
    setSelectedItems((prev) => {
      const exists = prev.some(
        (item) => item.groupKey === groupKey && item.label === label,
      );

      if (exists) {
        return prev.filter(
          (item) => !(item.groupKey === groupKey && item.label === label),
        );
      }

      return [...prev, { groupKey, groupTitle, label }];
    });
  }

  function isSelected(groupKey: string, label: string) {
    return selectedItems.some(
      (item) => item.groupKey === groupKey && item.label === label,
    );
  }

  const filteredGroups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return categoryGroups;
    }

    return categoryGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.toLowerCase().includes(normalizedSearch),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [search]);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <HeroBanner
        title="Daily check-in"
        subtitle="Log how you feel today in a way that feels organized, gentle, and easy to revisit."
      >
        <div
          style={{
            display: "inline-flex",
            padding: "0.8rem 1rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.18)",
            width: "fit-content",
            fontWeight: 600,
          }}
        >
          Save how you feel, one category at a time
        </div>
      </HeroBanner>

      <Card>
        <SectionHeader
          title="Date context"
          subtitle="Keep the selected date visible so the check-in always feels grounded."
        />
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <label>
            Date and time
            <input
              type="datetime-local"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>

          <div
            style={{
              padding: "1rem",
              borderRadius: "20px",
              background: "var(--color-surface-soft)",
              border: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>Cycle day</p>
            <strong style={{ fontSize: "1.5rem" }}>14</strong>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader
          title="What are you feeling today?"
          subtitle="Search or browse category groups and select what fits your day."
        />

        <label>
          Search
          <input
            type="text"
            placeholder="Search symptoms, moods, events..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </Card>

      <Card
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(251,207,232,0.16))",
        }}
      >
        <SectionHeader
          title="Selected today"
          subtitle="These are the items currently selected for this check-in."
        />

        {selectedItems.length === 0 ? (
          <div
            style={{
              padding: "1rem",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.7)",
              color: "var(--color-text-muted)",
            }}
          >
            No selections yet. Start by tapping the chips below.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.9rem" }}>
            {Array.from(new Set(selectedItems.map((item) => item.groupTitle))).map(
              (groupTitle) => (
                <div key={groupTitle}>
                  <p
                    style={{
                      marginBottom: "0.5rem",
                      color: "var(--color-text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {groupTitle}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {selectedItems
                      .filter((item) => item.groupTitle === groupTitle)
                      .map((item) => (
                        <Chip
                          key={`${item.groupKey}-${item.label}`}
                          label={item.label}
                          selected
                          onClick={() =>
                            toggleItem(item.groupKey, item.groupTitle, item.label)
                          }
                        />
                      ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </Card>

      {filteredGroups.map((group) => (
        <Card key={group.key}>
          <SectionHeader
            title={group.title}
            subtitle={`Choose anything that reflects your ${group.title.toLowerCase()} today.`}
          />

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {group.items.map((item) => (
              <Chip
                key={`${group.key}-${item}`}
                label={item}
                selected={isSelected(group.key, item)}
                onClick={() => toggleItem(group.key, group.title, item)}
              />
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <SectionHeader
          title="Notes"
          subtitle="Optional context for anything that does not fit a chip."
        />
        <textarea
          rows={5}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add a note about today..."
        />
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="button">Save Check-In</button>
      </div>
    </div>
  );
}