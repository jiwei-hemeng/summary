## 常用的mysql语句

连接数据库

```mysql
# mysql -h 主机地址 -u 用户名  -p 用户密码	
mysql -hlocalhost -uroot -p
```

退出MySQL数据库

```mysql
exit（回车）
```
查看该数据库下的表

```sql
show tables;
```

修改用户密码

```mysql
# mysqladmin -u 用户名 -p 旧密码 password 新密码
mysqladmin -u root -password ab12;
```

创建数据库

```mysql
# create database <数据库名>
create database book
```

显示数据库

```mysql
show databases;
```

删除数据库

```mysql
# drop database <数据库名>
drop database company;
```

选择数据库

```mysql
# use <数据库名>
use company;
```

创建数据表

```mysql
drop table if exists com_bacteria_ndr_dict;
CREATE TABLE `com_bacteria_ndr_dict`
(
  `bacteria_code` varchar(32) NOT NULL COMMENT '细菌代码',
  `bacteria_name` varchar(256) NOT NULL COMMENT '细菌名称',
  `ab_code` varchar(32) NOT NULL COMMENT '抗菌药物代码',
  `ab_name` varchar(64) NOT NULL COMMENT '抗菌药物名称',
  `seq_no` int unsigned COMMENT '显示顺序号',
  `created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后修改时间',
  PRIMARY KEY (`bacteria_code`,`ab_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

获取数据库表结构

```mysql
# desc <表名>;
desc user;
# 或者使用
show columns from user;
# 获取完整的数据库表结构
show full columns from user;
```

删除数据表

```mysql
# drop table <表名>	
drop table info;
# 如果该表存在就删除该表
drop table if exists company;
```

向数据表中插入数据

```mysql
# insert into <表名> [(字段名1)[,...字段名n])] value (值1）[,(值n)];
insert into student (id,name,age) value (1,'张三',13),(3, "王五", 28);
insert into student set id=2,name="李四",age=100;
```

查询数据表中的数据

```mysql
# select <字段1，字段2，...> from <表名> where <条件>; 	
select * from student;
```

修改数据表中的数据

```mysql
# update 表名 set 字段=新值,... where 条件;	
update student set age=20 where id=1;
```

增加字段（添加列）:

```mysql
# alter table 表名 add 字段 类型 其他;	
alter table student add address varchar(40) default null;
```

修改字段

```sql
# alter table [表名] modify [字段名] [类型] comment '是否发送OA';
alter table msg_type_config modify oa_flag tinyint(3) unsigned comment '是否发送OA';
# 修改表名
alter table test_a rename to test_b;
# 修改表注释
alter table test_a comment 'test_a字段注释';
```

删除字段  (删除列) :

```mysql
alter table student drop column nickName;
```

加主关键字

```mysql
# alter table 表名 add primary key (字段名);	
alter table student add primary key (id);
```

加唯一限制条件

```mysql
# alter table 表名 add unique 索引名（字段名）;	
alter table student add unique emp_name2(id);
```

修改数据库表名

```mysql
# rename table 原表名 to 新表名;
rename table student to stu;
```

删除记录

```mysql
# delete from 表名 where 表达式;
delete from student where id=1;
```

导出数据库

```mysql
# mysqldump -u 用户名 -p 数据库名 > 导出的文件名
mysqldump -uroot -p  company > 123.sql
```

导出数据表

```mysql
# mysqldump -u 用户名 -p 数据库名 表名>导出的文件名
mysqldump -uroot -p company admin > outfile.sql
```

**查看第n行后的m条记录**

```mysql
# select * from <表名> limit row,rows;
select * from student limit n,m;
```

**模糊查询**

​	like

   %表示任意多个任意字符

   _ 表示一个任意字符

```sql
select * from t_student where c_name like '孙';
select * from t_student where c_name like '孙%';
select * from t_student where c_name like '孙_';
```

**范围查询**

in 表示在一个非连续的范围内 , 可以使用 or 实现

```
select * from t_students where id in(1,3,8);
select * from t_students where id =1 or id =3 or id =8);
```

**空判断**

```sql
# 判断空值
select * from t_student where c_age is null;
# 判断非空值
select * from t_student where c_age is not null;
```

**多字段排序**

```sql
select * from t_student order by c_age desc,c_id asc;
```

