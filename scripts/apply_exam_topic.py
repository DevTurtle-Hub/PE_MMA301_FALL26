import os
import sys
import json
import subprocess

def apply_topic(
    app_name="BookShelf",
    entity_singular="book",
    entity_plural="books",
    field1_name="title",
    field1_label="Title",
    field1_max=100,
    field2_name="author",
    field2_label="Author",
    field2_max=60,
    category_name="genre",
    category_label="Genre",
    category_options=None,
    status_options=None,
):
    if category_options is None:
        category_options = ["Fiction", "Non-Fiction", "Academic", "Other"]
    if status_options is None:
        status_options = ["To Read", "Reading", "Finished"]

    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # 1. Update firestore.rules
    rules_path = os.path.join(root_dir, "firestore.rules")
    cat_str = ", ".join([f"'{c}'" for c in category_options])
    stat_str = ", ".join([f"'{s}'" for s in status_options])

    rules_content = f"""rules_version = '2';
service cloud.firestore {{
  match /databases/{{database}}/documents {{
    match /{entity_plural}/{{{entity_singular}Id}} {{
      // 1. Phai dang nhap
      // 2. Chi doc, sua, xoa du lieu cua chinh minh
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // 3. Quy tac them moi & cap nhat
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.{field1_name} is string 
        && request.resource.data.{field1_name}.trim().size() > 0 
        && request.resource.data.{field1_name}.size() <= {field1_max}
        && request.resource.data.{field2_name} is string 
        && request.resource.data.{field2_name}.trim().size() > 0 
        && request.resource.data.{field2_name}.size() <= {field2_max}
        && request.resource.data.{category_name} in [{cat_str}]
        && request.resource.data.status in [{stat_str}]
        && (!('rating' in request.resource.data) || (request.resource.data.rating is int && request.resource.data.rating >= 0 && request.resource.data.rating <= 5))
        && (!('notes' in request.resource.data) || (request.resource.data.notes is string && request.resource.data.notes.size() <= 300));

      allow update: if request.auth != null 
        && resource.data.userId == request.auth.uid
        && request.resource.data.userId == request.auth.uid;
    }}
  }}
}}
"""
    with open(rules_path, "w", encoding="utf-8") as f:
        f.write(rules_content)
    print(f"Updated {rules_path} for entity: {entity_plural}")

    # 2. Update entityConfig.ts
    config_path = os.path.join(root_dir, "src", "config", "entityConfig.ts")
    ts_content = f"""export interface FieldRule {{
  key: string;
  label: string;
  placeholder?: string;
  requiredMessage: string;
  maxLength: number;
  maxMessage: string;
}}

export interface EnumRule {{
  key: string;
  label: string;
  chooseLabel: string;
  emptyMessage: string;
  options: string[];
  priorities?: Record<string, number>;
}}

export interface NumericRule {{
  key: string;
  label: string;
  min: number;
  max: number;
  errorMessage: string;
}}

export interface NotesRule {{
  key: string;
  label: string;
  maxLength: number;
  maxMessage: string;
}}

export interface EntityConfig {{
  collectionName: string;
  entitySingular: string;
  entityPlural: string;
  appName: string;

  homeTitleTestId: string;
  formTestId: string;
  formSuccessTestId: string;
  formSuccessText: string;
  errorFormTestId: string;
  itemTestId: string;
  emptyListTestId: string;
  emptyListText: string;
  countTestId: string;
  favoriteCountTestId: string;

  field1: FieldRule;
  field2: FieldRule;
  category: EnumRule;
  status: EnumRule;
  numeric?: NumericRule;
  notes?: NotesRule;

  featureCards: {{ title: string; desc: string }}[];
}}

export const ENTITY_CONFIG: EntityConfig = {{
  collectionName: '{entity_plural}',
  entitySingular: '{entity_singular}',
  entityPlural: '{entity_plural}',
  appName: '{app_name}',

  homeTitleTestId: 'home-title',
  formTestId: '{entity_singular}-form',
  formSuccessTestId: '{entity_singular}-success',
  formSuccessText: '{entity_singular.capitalize()} added',
  errorFormTestId: 'error-{entity_singular}',
  itemTestId: '{entity_singular}-item',
  emptyListTestId: '{entity_plural}-empty',
  emptyListText: 'No {entity_plural} found',
  countTestId: '{entity_singular}-count',
  favoriteCountTestId: 'favorite-count',

  field1: {{
    key: '{field1_name}',
    label: '{field1_label}',
    placeholder: 'Enter {field1_label.lower()}',
    requiredMessage: '{field1_label} is required',
    maxLength: {field1_max},
    maxMessage: '{field1_label} must be at most {field1_max} characters',
  }},
  field2: {{
    key: '{field2_name}',
    label: '{field2_label}',
    placeholder: 'Enter {field2_label.lower()}',
    requiredMessage: '{field2_label} is required',
    maxLength: {field2_max},
    maxMessage: '{field2_label} must be at most {field2_max} characters',
  }},
  category: {{
    key: '{category_name}',
    label: '{category_label}',
    chooseLabel: 'Choose {category_label.lower()}',
    emptyMessage: 'Please choose a {category_label.lower()}',
    options: {json.dumps(category_options)},
  }},
  status: {{
    key: 'status',
    label: 'Status',
    chooseLabel: 'Choose status',
    emptyMessage: 'Please choose a status',
    options: {json.dumps(status_options)},
    priorities: {{
      '{status_options[0] if len(status_options) > 0 else "Pending"}': 1,
      '{status_options[1] if len(status_options) > 1 else "In Progress"}': 2,
      '{status_options[2] if len(status_options) > 2 else "Completed"}': 3,
    }},
  }},
  numeric: {{
    key: 'rating',
    label: 'Rating (0 - 5, optional)',
    min: 0,
    max: 5,
    errorMessage: 'Rating must be a whole number from 0 to 5',
  }},
  notes: {{
    key: 'notes',
    label: 'Notes (max 300 characters, optional)',
    maxLength: 300,
    maxMessage: 'Notes must be at most 300 characters',
  }},
  featureCards: [
    {{
      title: '📋 Track your {entity_plural}',
      desc: 'Add and manage {entity_plural} in your private collection with custom notes and ratings.',
    }},
    {{
      title: '🏷️ Sort by status',
      desc: 'Organize {entity_plural} seamlessly into {", ".join(status_options)} with instant filtering.',
    }},
    {{
      title: '⭐ Rate your favorites',
      desc: 'Star your favorite {entity_plural} with one tap and filter favorite items instantly.',
    }},
  ],
}};
"""
    with open(config_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Updated {config_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].endswith(".json"):
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            cfg = json.load(f)
            apply_topic(**cfg)
    else:
        apply_topic()

